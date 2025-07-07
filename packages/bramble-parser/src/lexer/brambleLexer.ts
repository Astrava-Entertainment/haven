import * as fs from 'fs'
import { LexerRules } from "./brambleLexerRule";
import { ELexerTokens, ErrorCode } from '~/common';
import { HavenException } from '~/errors';
import { ChunkParser } from '~/parser/chunkParser';

export class BrambleLexer {
  documentContent: string;
  tokens: ILexerToken[];
  tokensByLine: ILexerToken[][]
  chunks: IChunkBlock[];
  chunkMap: ChunkMap[]

  constructor(document: string) {
    this.tokens = [];
    this.tokensByLine = [];
    this.chunks = [];
    this.chunkMap = [];
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
        throw new HavenException('Unrecognized token', currentLine, currentStart, ErrorCode.UNRECOGNIZED_TOKEN);
      }
    }
  }

  tokenizeContent(content: string) {
    this.documentContent = content;
    this.tokenize();
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
  tryExtractChunkType(token: ILexerToken[], index: number) {
    const keywordToken = token[1];
    if (keywordToken.type !== ELexerTokens.KW_CHUNK) {
      //* Instead of throwing a blank error create a ErrorClass
      //* like HavenException which contains semantic text on why the error happened, give it an array of LexerError Objects
      throw new HavenException('Invalid chunk declaration', index + 1, keywordToken.start, ErrorCode.INVALID_CHUNK_DECLARATION)
    }

    const chunkTypeToken = token[3];
    if (!chunkTypeToken || chunkTypeToken.type !== ELexerTokens.STRING) {
      throw new HavenException('Missing chunk type', index + 1, chunkTypeToken.start, ErrorCode.MISSING_CHUNK_TYPE)
    }

    return chunkTypeToken.value;
  }


  groupByChunkContext() {
    const chunkParser = new ChunkParser(this.tokensByLine);
    this.chunks = chunkParser.parse();
  }

  checkHashReferencesBetweenFiles() {
    ChunkParser.validateChunks(this.chunks);
  }

  mapChunks() {
    for (const chunk of this.chunks) {
      const { type, range, offset } = ChunkParser.parseChunkHeaderTokens(chunk.headerTokens);

      this.chunkMap.push({
        type,
        range,
        offset,
        entries: chunk.lines
      });
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


  run() {
    this.tokenize();
    this.groupTokensByLine();
    this.groupByChunkContext();
    this.checkHashReferencesBetweenFiles();
    this.mapChunks();
  }

  getChunks() {
    if (this.chunks === null) {
      throw new HavenException('Chunks are not initialized', 0, 0, ErrorCode.EMPTY_CHUNKS)
    }
    return this.chunks;
  }

  getChunkMap() {
    if (this.chunkMap === null) {
      throw new HavenException('Chunk maps are empty', 0, 0, ErrorCode.EMPTY_CHUNKS)
    }
    return this.chunkMap;
  }
}
