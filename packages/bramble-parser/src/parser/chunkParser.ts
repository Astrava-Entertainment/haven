import { ELexerTokens } from '~/common';
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

    const flushCurrentChunk = () => {
      if (!currentChunkType) return;
      chunks.push({
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
    };

    this.tokensByLine.forEach((tokens, index) => {
      if (tokens.length === 0) return;

      const firstToken = tokens[0];

      if (this.isChunkHeader(firstToken)) {

        //? TODO: Convert this method with parameters to avoid repeating the same validation logic and reduce cognitive load
        //? This method can be promoted to a pure method as it can be error prone if the logic grows
        //? The problem is that it depends on a bunch of mutable outer variables, remove the dependency
        flushCurrentChunk();

        //* Consider merging these or letting extractChunkInfo() call processChunkHeader() internally.
        this.processChunkHeader(tokens, index);
        ({ currentChunkType, currentChunkHeader } = this.extractChunkInfo(tokens, index));
        return;
      }

      if (currentChunkType) {
        this.validateTokenForChunk(allowedByChunk, currentChunkType, tokens, index);
        currentChunkLines.push(tokens);
      }
    });

    //? TODO: Convert this method with parameters to avoid repeating the same validation logic and reduce cognitive load
    //? This method can be promoted to a pure method as it can be error prone if the logic grows
    //? The problem is that it depends on a bunch of mutable outer variables, remove the dependency
    flushCurrentChunk();

    return chunks;
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
      throw new HavenException(`Invalid chunk declaration at line ${lineIndex + 1}`);
    }

    if (!tokens[3] || tokens[3].type !== ELexerTokens.STRING) {
      throw new HavenException(`Missing chunk type at line ${lineIndex + 1}`);
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
      throw new HavenException(`Unknown chunk type "${chunkType}" at line ${lineIndex + 1}`);
    }

    const firstTokenType = tokens[0].type;
    if (!allowedTokens.includes(firstTokenType)) {
      throw new HavenException(`Invalid token ${ELexerTokens[firstTokenType]} in chunk "${chunkType}" at line ${lineIndex + 1}`);
    }
  }
}
