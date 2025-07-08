import { ELexerTokens } from '~/common';
import { CHUNK_HEADER_HASH_INDEX, CHUNK_LINE_HASH_INDEX, CHUNK_LINE_INDEX } from '~/constants';
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
      throw new HavenException(`Invalid chunk declaration at line ${index + 1}`);
    }

    if (!tokens[3] || tokens[3].type !== ELexerTokens.STRING) {
      throw new HavenException(`Missing chunk type at line ${index + 1}`);
    }

    return {
      currentChunkType: tokens[3].value,
      currentChunkHeader: tokens
    };
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
      throw new HavenException(`Unknown chunk type "${chunkType}" at line ${lineIndex + 1}`);
    }
    const token = tokens[0];
    const firstTokenType = token.type;
    if (!allowedTokens.includes(firstTokenType)) {
      throw new HavenException(`Invalid token ${ELexerTokens[firstTokenType]} in chunk "${chunkType}" at line ${lineIndex + 1}:${token.start}-${token.end}`);
    }
  }

  private static getStringTokenAt(tokens: ILexerToken[], index: number, context: string): string {
    const token = tokens[index];

    if (!token) {
      throw new HavenException(`Missing token at index ${index} in ${context}`);
    }

    if (token.type !== ELexerTokens.ID) {
      const actual = ELexerTokens[token.type];
      throw new HavenException(`Expected ID token at index ${index} at line ${token.line + 1} in ${context}, but got ${actual}: ${token.value}`);
    }

    return token.value;
  }

  public static validateChunks(chunks: IChunkBlock[]): void {
    for (const chunk of chunks) {
      if (chunk.type === 'history') {
        const hashRef = this.getStringTokenAt(chunk.headerTokens, CHUNK_HEADER_HASH_INDEX, 'header token');
        const hashRefHist = this.getStringTokenAt(chunk.lines[CHUNK_LINE_INDEX], CHUNK_LINE_HASH_INDEX, 'hash references');
        const lineNumber = this.getStringTokenAt(chunk.lines[CHUNK_LINE_INDEX], CHUNK_LINE_HASH_INDEX, 'line number');

        if (hashRef !== hashRefHist) {
          throw new HavenException(`Invalid hash history reference: ${hashRefHist} at line ${lineNumber + 1} `);
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
              throw new HavenException(`Missing META for file ${hashRef} at line ${lineNumber + 1} `);
            }

            const hashRefMeta = nextLine[2].value;

            if (hashRef !== hashRefMeta) {
              const metaLineNumber = nextLine[2].line;
              throw new HavenException(`Mismatch between FILE and META hashes at line ${metaLineNumber + 1} `);
            }
          }
        }
      }
    }
  }

}
