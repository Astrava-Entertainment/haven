export { }

declare global {

  interface ErrorConstructor {
    captureStackTrace?: (targetObject: object, constructorOpt?: Function) => void;
  }

  interface ChunkMap {
    type: string;            // Ej: files, directories, refs, history
    range?: [number, number];
    offset?: number;
    entries: ILexerToken[][];
  }
}
