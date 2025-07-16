import { BrambleLexer } from "./lexer/brambleLexer";
import { BrambleFSParser } from "./parser/parser";
import { errorManager } from "./errors/errorManager";

export class Bramble {
  private lexer: BrambleLexer;
  private parser: BrambleFSParser;

  constructor(filePath: string) {
    this.lexer = new BrambleLexer(filePath);
    this.parser = new BrambleFSParser(this.lexer.getChunkMap());
  }

  run(): void {
    this.lexer.run();
    this.parser.run();
  }

  getChunkMap() {
    return this.lexer.getChunkMap();
  }

  getJSON() {
    return this.parser.getJSON();
  }

  getErrors() {
    return errorManager.getAll();
  }

  logErrors() {
    return errorManager.getAll();
  }

  debugChunks() {
    this.lexer.debugChunks();
  }

  debugFS() {
    this.parser.debugFS();
  }
}
