import { errorManager } from "./errors/errorManager";
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

  const errors = errorManager.getAll();
  if (errors.length > 0) {
    console.log('Errors found:', errors.length);
    errorManager.log();
  }


} catch (_) { }
