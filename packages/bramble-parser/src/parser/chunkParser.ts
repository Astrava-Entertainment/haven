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

  private parseChunkHeader(tokens: ILexerToken[], index: number): { currentChunkType: string; currentChunkHeader: ILexerToken[] } {
    if (tokens[1]?.type !== ELexerTokens.KW_CHUNK) {
      throw new HavenException('Invalid chunk declaration', index + 1, tokens[1].start, ErrorCode.INVALID_CHUNK_DECLARATION);
    }

    if (!tokens[3] || tokens[3].type !== ELexerTokens.STRING) {
      throw new HavenException('Missing chunk type', index + 1, tokens[3].start, ErrorCode.MISSING_CHUNK_TYPE);
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
      throw new HavenException('Missing chunk type', 0, 0, ErrorCode.MISSING_CHUNK_TYPE);
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
      throw new HavenException(`Unknown chunk type "${chunkType}"`, lineIndex + 1, 0, ErrorCode.UNKNOWN_CHUNK_TYPE);
    }
    const token = tokens[0];
    const firstTokenType = token.type;
    if (!allowedTokens.includes(firstTokenType)) {
      throw new HavenException(`Invalid token ${ELexerTokens[firstTokenType]} in chunk "${chunkType}"`, lineIndex + 1, token.start, ErrorCode.INVALID_TOKEN_IN_CHUNK);
    }
  }

  private static getStringTokenAt(tokens: ILexerToken[], index: number, context: string): string {
    if (!tokens) {
      throw new HavenException(`Missing tokens at index ${index} in ${context}`, 0, 0, ErrorCode.MISSING_TOKEN);
    }

    const token = tokens[index];

    if (!token) {
      // This error has line and column 0, because token does not exist
      throw new HavenException(`Missing token at index ${index} in ${context}`, 0, 0, ErrorCode.MISSING_TOKEN);
    }

    if (token.type !== ELexerTokens.ID) {
      const actual = ELexerTokens[token.type];
      throw new HavenException(`Expected ID token at index ${index} in ${context}, but got ${actual}: ${token.value}`, token.line, token.start, ErrorCode.INVALID_TOKEN_IN_CHUNK);
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
          throw new HavenException(`Invalid hash history reference: ${hashRefHist}`, parseInt(lineNumber + 1), 0, ErrorCode.INVALID_HASH_HISTORY);
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
              throw new HavenException(`Missing META for file ${hashRef}`, lineNumber + 1, 0, ErrorCode.MISSING_META_FOR_FILE);
            }

            const hashRefMeta = nextLine[META_HASH_INDEX].value;

            if (hashRef !== hashRefMeta) {
              const metaLineNumber = nextLine[META_HASH_INDEX].line;
              throw new HavenException(`Mismatch between FILE and META hashes at line ${metaLineNumber + 1}`, metaLineNumber + 1, nextLine[2].start, ErrorCode.FILE_META_HASH_MISMATCH);
            }
          }
        }
      }
    }
  }

}
