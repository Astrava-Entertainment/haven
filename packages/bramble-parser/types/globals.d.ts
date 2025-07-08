export { }

declare global {
  interface Position {
    line: number;
    column: number;
  }

  interface ErrorConstructor {
    captureStackTrace?: (targetObject: object, constructorOpt?: Function) => void;
  }

  interface ChunkMap {
    type: string;            // files, directories, refs, history
    range?: [number, number];
    offset?: number;
    entries: ILexerToken[][];
  }
}
