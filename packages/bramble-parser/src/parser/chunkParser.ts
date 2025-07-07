import { ELexerTokens, ErrorCode } from '~/common';
import { CHUNK_HEADER_HASH_INDEX, CHUNK_LINE_HASH_INDEX, CHUNK_LINE_INDEX, META_HASH_INDEX } from '~/constants';
import { HavenException } from '~/errors';

export class ChunkParser {
  private tokensByLine: ILexerToken[][];

  constructor(tokensByLine: ILexerToken[][]) {
    this.tokensByLine = tokensByLine;
  }

  parse(): IChunkBlock[] {
    const allowedByChunk = this.getAllowedTokensByChunk();

    let currentChunkType: string | null = null;
    let currentChunkHeader: ILexerToken[] = [];
    let currentChunkLines: ILexerToken[][] = [];

    const chunks: IChunkBlock[] = [];

    this.tokensByLine.forEach((tokens, index) => {
      if (tokens.length === 0) return;

      const firstToken = tokens[0];

      if (this.isChunkHeader(firstToken)) {
        this.flushCurrentChunk(currentChunkType, currentChunkHeader, currentChunkLines, chunks);
        currentChunkType = null;
        currentChunkHeader = [];
        currentChunkLines = [];

        ({ currentChunkType, currentChunkHeader } = this.parseChunkHeader(tokens, index));

        return;
      }

      if (currentChunkType) {
        this.validateTokenForChunk(allowedByChunk, currentChunkType, tokens, index);
        currentChunkLines.push(tokens);
      }
    });

    this.flushCurrentChunk(currentChunkType, currentChunkHeader, currentChunkLines, chunks);
    currentChunkType = null;
    currentChunkHeader = [];
    currentChunkLines = [];

    return chunks;
  }

  // TODO: Magic numbers
  private parseChunkHeader(tokens: ILexerToken[], index: number): { currentChunkType: string; currentChunkHeader: ILexerToken[] } {
    // chunk declarion psotion 1
    if (tokens[1]?.type !== ELexerTokens.KW_CHUNK) {
      const position = { line: index + 1, column: tokens[1].start };
      throw new HavenException('Invalid chunk declaration', position, ErrorCode.INVALID_CHUNK_DECLARATION);
    }
    // chunk type position 3
    if (!tokens[3] || tokens[3].type !== ELexerTokens.STRING) {
      const position = { line: index + 1, column: tokens[3].start };
      throw new HavenException('Missing chunk type', position, ErrorCode.MISSING_CHUNK_TYPE);
    }

    return {
      currentChunkType: tokens[3].value,
      currentChunkHeader: tokens
    };
  }

  public static parseChunkHeaderTokens(header: ILexerToken[]): ParsedHeaderInfo {
    let type = '';
    let range: [number, number] | undefined;
    let offset: number | undefined;

    for (let i = 0; i < header.length; i++) {
      if (header[i].type === ELexerTokens.STRING) {
        type = header[i].value;
      }
    }

    for (let i = 0; i < header.length - 2; i++) {
      if (
        header[i].type === ELexerTokens.ID &&
        header[i + 1].type === ELexerTokens.LINE &&
        header[i + 2].type === ELexerTokens.ID
      ) {
        const start = parseInt(header[i].value, 10);
        const end = parseInt(header[i + 2].value, 10);
        if (!isNaN(start) && !isNaN(end)) {
          range = [start, end];
        }
      }
    }

    for (let i = 0; i < header.length - 1; i++) {
      if (header[i].type === ELexerTokens.AT && header[i + 1].type === ELexerTokens.ID) {
        const off = parseInt(header[i + 1].value, 10);
        if (!isNaN(off)) {
          offset = off;
        }
      }
    }

    if (!type) {
      const position = { line: 0, column: 0 };
      throw new HavenException('Missing chunk type', position, ErrorCode.MISSING_CHUNK_TYPE);
    }

    return { type, range, offset };
  }


  private flushCurrentChunk(
    chunkType: string | null,
    header: ILexerToken[],
    lines: ILexerToken[][],
    chunks: IChunkBlock[]
  ): void {
    if (!chunkType) return;
    chunks.push({
      type: chunkType,
      headerTokens: header,
      lines: lines,
    });
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

  private validateTokenForChunk(
    allowedByChunk: Record<string, ELexerTokens[]>,
    chunkType: string,
    tokens: ILexerToken[],
    lineIndex: number
  ): void {
    const allowedTokens = allowedByChunk[chunkType];
    if (!allowedTokens) {
      const position = { line: lineIndex + 1, column: 0 };
      throw new HavenException(`Unknown chunk type "${chunkType}"`, position, ErrorCode.UNKNOWN_CHUNK_TYPE);
    }
    const token = tokens[0];
    const firstTokenType = token.type;
    if (!allowedTokens.includes(firstTokenType)) {
      const position = { line: lineIndex + 1, column: token.start };
      throw new HavenException(`Invalid token ${ELexerTokens[firstTokenType]} in chunk "${chunkType}"`, position, ErrorCode.INVALID_TOKEN_IN_CHUNK);
    }
  }

  private static getStringTokenAt(tokens: ILexerToken[], index: number, context: string): string {
    if (!tokens) {
      const position = { line: 0, column: 0 };
      throw new HavenException(`Missing tokens at index ${index} in ${context}`, position, ErrorCode.MISSING_TOKEN);
    }

    const token = tokens[index];

    if (!token) {
      // TODO: This error has line and column 0, because token does not exist
      const position = { line: 0, column: 0 };
      throw new HavenException(`Missing token at index ${index} in ${context}`, position, ErrorCode.MISSING_TOKEN);
    }

    if (token.type !== ELexerTokens.ID) {
      const actual = ELexerTokens[token.type];
      const position = { line: token.line, column: token.start };
      throw new HavenException(`Expected ID token at index ${index} in ${context}, but got ${actual}: ${token.value}`, position, ErrorCode.INVALID_TOKEN_IN_CHUNK);
    }

    return token.value;
  }

  public static validateChunks(chunks: IChunkBlock[]): void {
    for (const chunk of chunks) {
      if (chunk.type === 'history') {
        if (chunk.lines.length === 0) continue;

        const hashRef = this.getStringTokenAt(chunk.headerTokens, CHUNK_HEADER_HASH_INDEX, 'header token');
        const hashRefHist = this.getStringTokenAt(chunk.lines[CHUNK_LINE_INDEX], CHUNK_LINE_HASH_INDEX, 'hash references');
        const lineNumber = this.getStringTokenAt(chunk.lines[CHUNK_LINE_INDEX], CHUNK_LINE_HASH_INDEX, 'line number');

        if (hashRef !== hashRefHist) {
          const position = { line: parseInt(lineNumber + 1), column: 0 };
          throw new HavenException(`Invalid hash history reference: ${hashRefHist}`, position, ErrorCode.INVALID_HASH_HISTORY);
        }
      }

      if (chunk.type === 'files') {
        for (let i = 0; i < chunk.lines.length; i++) {
          const line = chunk.lines[i];

          if (line[CHUNK_LINE_INDEX].type === ELexerTokens.KW_FILE) {
            const hashRef = line[CHUNK_LINE_HASH_INDEX].value;
            const lineNumber = line[CHUNK_LINE_HASH_INDEX].line;

            const nextLine = chunk.lines[i + 1];

            if (!nextLine || nextLine[CHUNK_LINE_INDEX].type !== ELexerTokens.KW_META) {
              const position = { line: lineNumber + 1, column: 0 };
              throw new HavenException(`Missing META for file ${hashRef}`, position, ErrorCode.MISSING_META_FOR_FILE);
            }

            const hashRefMeta = nextLine[META_HASH_INDEX].value;

            if (hashRef !== hashRefMeta) {
              const metaLineNumber = nextLine[META_HASH_INDEX].line;
              const position = { line: metaLineNumber + 1, column: nextLine[2].start };
              throw new HavenException(`Mismatch between FILE and META hashes at line ${metaLineNumber + 1}`, position, ErrorCode.FILE_META_HASH_MISMATCH);
            }
          }
        }
      }
    }
  }

}
