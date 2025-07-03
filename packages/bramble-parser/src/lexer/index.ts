import { BrambleLexer } from "./brambleLexer";

// Example usage:
try {
  const myClass = new BrambleLexer('./src/fixtures/example.havenfs');
  myClass.tokenize();
  myClass.groupTokensByLine();
  myClass.groupByChunkContext();
  myClass.checkHashReferencesBetweenFiles();
  myClass.debugChunks();
} catch (_) { }
