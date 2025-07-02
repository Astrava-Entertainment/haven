import * as fs from 'fs'
import { ELexerTokens, IChunkBlock, ILexerToken } from "./brambleToken";
import { LexerRules } from "./BrambleLexerRule";

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
    let remaining = this.documentContent;
    while (remaining.length > 0) {
      let matched = false
      for (const rule of LexerRules) {
        const match = rule.pattern.exec(remaining);
        if (match) {
          this.tokens.push({
            type: rule.tokenToMatch,
            value: match[0],
            line: 0
          });
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        throw new Error(`Unrecognized token: ${remaining[0]}`);
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


  private tryExtractChunkType(token: ILexerToken[], index: number) {
    const keywordToken = token[1];
    if (keywordToken.type !== ELexerTokens.KW_CHUNK) {
      throw new Error(`Invalid chunk declaration at line ${index + 1}`)
    }

    const chunkTypeToken = token[3];
    if (!chunkTypeToken || chunkTypeToken.type !== ELexerTokens.STRING) {
      throw new Error(`Missing chunk type at line ${index + 1}`)
    }

    return chunkTypeToken.value;
  }

  groupByChunkContext() {
    const allowedByChunk = this.getAllowedTokensByChunk();

    let currentChunkType: string | null = null;
    let currentChunkHeader: ILexerToken[] = [];
    let currentChunkLines: ILexerToken[][] = [];
    let currentChunkStartLine: number = 0;

    const flushCurrentChunk = () => {
      if (!currentChunkType) return;
      this.chunks.push({
        type: currentChunkType,
        headerTokens: currentChunkHeader,
        lines: currentChunkLines,
      });
      resetCurrentChunk();
    };

    const resetCurrentChunk = () => {
      currentChunkType = null;
      currentChunkHeader = [];
      currentChunkLines = [];
    }
    this.tokensByLine.forEach((tokens, index) => {
      if (tokens.length === 0) return;

      const firstToken = tokens[0];

      if (this.isChunkHeader(firstToken)) {
        flushCurrentChunk();
        this.processChunkHeader(tokens, index);
        ({ currentChunkType, currentChunkHeader } = this.extractChunkInfo(tokens, index));
        return;
      }

      if (currentChunkType) {
        this.validateTokenForChunk(allowedByChunk, currentChunkType, tokens, index);
        currentChunkLines.push(tokens);
      }
    });

    flushCurrentChunk();
  }

  private getAllowedTokensByChunk(): Record<string, ELexerTokens[]> {
    return {
      files: [ELexerTokens.KW_FILE, ELexerTokens.KW_META],
      directories: [ELexerTokens.KW_DIR],
      refs: [ELexerTokens.KW_REF],
      history: [ELexerTokens.KW_HIST],
    };
  }

  private isChunkHeader(token: ILexerToken): boolean {
    return token.type === ELexerTokens.HASH;
  }

  private processChunkHeader(tokens: ILexerToken[], lineIndex: number): void {
    if (tokens[1]?.type !== ELexerTokens.KW_CHUNK) {
      throw new Error(`Invalid chunk declaration at line ${lineIndex + 1}`);
    }

    if (!tokens[3] || tokens[3].type !== ELexerTokens.STRING) {
      throw new Error(`Missing chunk type at line ${lineIndex + 1}`);
    }
  }

  private extractChunkInfo(tokens: ILexerToken[], lineIndex: number): { currentChunkType: string; currentChunkHeader: ILexerToken[] } {
    const chunkTypeToken = tokens[3];
    // console.log(`Current chunk context: ${chunkTypeToken.value}`);
    return {
      currentChunkType: chunkTypeToken.value,
      currentChunkHeader: tokens,
    };
  }

  private validateTokenForChunk(
    allowedByChunk: Record<string, ELexerTokens[]>,
    chunkType: string,
    tokens: ILexerToken[],
    lineIndex: number
  ): void {
    const allowedTokens = allowedByChunk[chunkType];
    if (!allowedTokens) {
      throw new Error(`Unknown chunk type "${chunkType}" at line ${lineIndex + 1}`);
    }

    const firstTokenType = tokens[0].type;
    if (!allowedTokens.includes(firstTokenType)) {
      throw new Error(`Invalid token ${ELexerTokens[firstTokenType]} in chunk "${chunkType}" at line ${lineIndex + 1}`);
    }
  }

  checkHashReferencesBetweenFiles() {
    for (const chunk of this.chunks) {
      // TODO: Replace this magics word
      if (chunk.type === 'history') {
        const hashRef = chunk.headerTokens[5].value
        const hashRefHist = chunk.lines[0][2].value;
        const lineNumber = chunk.lines[0][2].line;

        if (hashRef !== hashRefHist) {
          throw new Error(`Invalid hash history reference: ${hashRefHist} at line ${lineNumber + 1}`)
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
              throw new Error(`Missing META for file ${hashRef} at line ${lineNumber + 1}`);
            }

            const hashRefMeta = nextLine[2].value;

            if (hashRef !== hashRefMeta) {
              const metaLineNumber = nextLine[2].line;
              throw new Error(`Mismatch between FILE and META hashes at line ${metaLineNumber + 1}`);
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

// Example usage:
// const myClass = new BrambleLexer('./fixtures/example.havenfs');
// myClass.tokenize();
// myClass.groupTokensByLine();
// myClass.groupByChunkContext();
// myClass.checkHashReferencesBetweenFiles();
// myClass.debugChunks();
