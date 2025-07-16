import { Glob } from "bun";
import { errorManager } from "./src/errors/errorManager";
import { BrambleLexer } from "./src/lexer";
import { BrambleFSParser } from "./src/parser/parser";

try {
  const glob = new Glob("./*.havenfs");

  let found = false;

  for (const filePath of glob.scan(".")) {
    found = true;
    console.log("Found file:", filePath);

    const lexer = new BrambleLexer(filePath);
    lexer.run();

    const chunkMap = lexer.getChunkMap();
    const parser = new BrambleFSParser(chunkMap);
    parser.run();
    parser.debugFS();

    const errors = errorManager.getAll();
    if (errors.length > 0) {
      console.log("Errors found:", errors.length);
      errorManager.log();
    } else {
      console.log("No errors found in", filePath);
    }

    errorManager.clear();
  }

  if (!found) {
    console.log("No .havenfs files found in the current directory.");
  }

} catch (e) {
  console.error("Unexpected error:", e);
}
