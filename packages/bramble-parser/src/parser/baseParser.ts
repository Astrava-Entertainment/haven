export abstract class BaseParser {
  entries: ILexerToken[][];

  constructor(entries: ILexerToken[][]) {
    this.entries = entries;
  }

  abstract parse(): void;
}
