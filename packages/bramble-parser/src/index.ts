import { BrambleLexer } from "./lexer";
import { BrambleFSParser } from "./parser/parser";

// Example usage:
try {
  const lexer = new BrambleLexer('./src/fixtures/example.havenfs');
  lexer.run();

  const chunkMap = lexer.getChunkMap();
  const parser = new BrambleFSParser(chunkMap);
  parser.run();
  parser.debugFS();
} catch (_) { }
