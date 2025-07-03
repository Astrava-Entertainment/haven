import * as fs from 'fs'
import { LexerRules } from "./brambleLexerRule";
import { ELexerTokens } from '~/common';
import { HavenException } from '~/errors';
import { ChunkParser } from '~/parser/chunkParser';

export class BrambleLexer {
  documentContent: string;
  tokens: ILexerToken[];
  tokensByLine: ILexerToken[][]
  chunks: IChunkBlock[];


  constructor(document: string) {
    this.tokens = [];
    this.tokensByLine = [];
    this.chunks = [];
    this.documentContent = fs.readFileSync(document, 'utf8');
  }

  tokenize() {
    let currentLine = 0;
    let currentStart = 0;
    let currentEnd = 0;
    let cursor = 0;
    let remaining = this.documentContent;
    while (remaining.length > 0) {
      let matched = false
      for (const rule of LexerRules) {
        const match = rule.pattern.exec(remaining);
        if (!match) continue;
        const value = match[0];
        const newlines = value.split('\n').length - 1;

        if (newlines) cursor = 0;
        cursor += value.length;
        currentStart = cursor - value.length;
        currentEnd = currentStart + value.length;

        if (match) {
          this.tokens.push({
            type: rule.tokenToMatch,
            value,
            line: currentLine,
            start: currentStart,
            end: currentEnd
          });
          currentLine += newlines;
          remaining = remaining.slice(value.length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        throw new HavenException(`Unrecognized token: ${remaining[0]}`);
      }
    }
  }

  groupTokensByLine() {
    let currentLine: ILexerToken[] = [];
    let currentLineIndex = 0;

    for (const token of this.tokens) {
      if (token.type === ELexerTokens.NEWLINE) {
        if (currentLine.length > 0) {
          for (const current of currentLine) {
            current.line = currentLineIndex;
          }
          this.tokensByLine.push(currentLine);
          currentLine = [];
        }
        currentLineIndex++;
      } else {
        currentLine.push(token);
      }
    }

    if (currentLine.length > 0) {
      for (const current of currentLine) {
        current.line = currentLineIndex;
      }
      this.tokensByLine.push(currentLine);
    }
  }

  // Unused, think it is for debugging
  private tryExtractChunkType(token: ILexerToken[], index: number) {
    const keywordToken = token[1];
    if (keywordToken.type !== ELexerTokens.KW_CHUNK) {
      //* Instead of throwing a blank error create a ErrorClass
      //* like HavenException which contains semantic text on why the error happened, give it an array of LexerError Objects
      throw new HavenException(`Invalid chunk declaration at line ${index + 1}`)
    }

    const chunkTypeToken = token[3];
    if (!chunkTypeToken || chunkTypeToken.type !== ELexerTokens.STRING) {
      throw new HavenException(`Missing chunk type at line ${index + 1}`)
    }

    return chunkTypeToken.value;
  }


  groupByChunkContext() {
    const parser = new ChunkParser(this.tokensByLine);
    this.chunks = parser.parse();
  }

  checkHashReferencesBetweenFiles() {
    for (const chunk of this.chunks) {
      // TODO: Replace these magic numbers
      //* Pro TIP: Create a function named getStringTokenAt(index) which safely deals with the data and handles any errors in case they surface
      //* Also move chunk logic into its own class, I think it would give you more clarity and scalability
      if (chunk.type === 'history') {
        const hashRef = chunk.headerTokens[5].value
        const hashRefHist = chunk.lines[0][2].value;
        const lineNumber = chunk.lines[0][2].line;

        if (hashRef !== hashRefHist) {
          throw new HavenException(`Invalid hash history reference: ${hashRefHist} at line ${lineNumber + 1}`)
        }
      }

      if (chunk.type === 'files') {
        for (let i = 0; i < chunk.lines.length; i++) {
          const line = chunk.lines[i];

          if (line[0].type === ELexerTokens.KW_FILE) {
            const hashRef = line[2].value;

            const lineNumber = line[2].line;

            const nextLine = chunk.lines[i + 1];

            if (!nextLine || nextLine[0].type !== ELexerTokens.KW_META) {
              throw new HavenException(`Missing META for file ${hashRef} at line ${lineNumber + 1}`);
            }

            const hashRefMeta = nextLine[2].value;

            if (hashRef !== hashRefMeta) {
              const metaLineNumber = nextLine[2].line;
              throw new HavenException(`Mismatch between FILE and META hashes at line ${metaLineNumber + 1}`);
            }
          }
        }
      }
    }
  }

  debugChunks() {
    console.log("=".repeat(50));
    console.log(`Found ${this.chunks.length} chunks`);
    console.log("=".repeat(50));
    for (const chunk of this.chunks) {
      console.log(`Chunk type: ${chunk.type}`);
      console.log("Header:", chunk.headerTokens.map(t => `[${ELexerTokens[t.type]}]`).join(" "));
      console.log(`Contains ${chunk.lines.length} lines`);
      for (const line of chunk.lines) {
        console.log(
          "  - " + line.map(t => `[${ELexerTokens[t.type]}]`).join(" ")
        );
      }
      console.log("-".repeat(50));
    }
  }

  debugReadTokensByLine() {
    this.tokensByLine.forEach((line, index) => {
      console.log('='.repeat(40));
      console.log(`Line ${index + 1}:`);
      for (const token of line) {
        const tokenName = ELexerTokens[token.type];
        console.log(`  [${tokenName}] ${token.value}`);
      }
      if (line.length === 0) {
        console.log('  (empty line)');
      }
    });
    console.log('='.repeat(40));
  }
}
