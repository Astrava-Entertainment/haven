export { }

declare global {
  interface ILexerToken {
    type: import('../src/common').ELexerTokens;
    value: string;
    line: number;
    start: number; //* Allows for later integration with an editor or higlighting invalid references with an underline
    end: number; //* Allows for later integration with an editor or higlighting invalid references with an underline
  }

  interface IChunkBlock {
    type: string;
    headerTokens: ILexerToken[];    // the tokens from the chunk header line
    lines: ILexerToken[][];         // tokenized lines belonging to this chunk
  }

  interface ParsedHeaderInfo {
    type: string;
    range?: [number, number];
    offset?: number;
  }

}
