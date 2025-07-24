import { Glob } from "bun";
import { errorManager } from "./src/errors/errorManager";
import { BrambleLexer } from "./src/lexer";
import { BrambleFSParser } from "./src/parser/parser";

async function main() {
  try {
    const glob = new Glob("*.havenfs");

    const paths = await Array.fromAsync(glob.scan("."))

    if (paths.length === 0) {
      console.log("No .havenfs files found in the current directory.");
      return;
    }

    await Promise.all(
      paths.map(async (filePath) => {
        console.log("Found file:", filePath);

        const lexer = new BrambleLexer({document: filePath});
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
      })
    );
  } catch (e) {
    console.error("Unexpected error:", e);
  }
}

main();
