import { test, expect } from "bun:test";
import { BrambleLexer } from "~/lexer";
import { BrambleFSParser } from "~/parser/parser";
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const testFilePath = join(__dirname, 'examples', 'test.havenfs');

test("System Test - parses entire file correctly", () => {
  const input = `#CHUNK files 0-999 @0
FILE f1a7e parent=92e1f name=logo.png size=20320 tags=branding,logo:#ffffff
META f1a7e modified=20240812T1419 created=20240712T1419 mimetype=image/png

#CHUNK directories @25000
DIR 92e1f parent=root name=images
`;

  fs.writeFileSync(testFilePath, input);

  const lexer = new BrambleLexer({document: testFilePath});
  lexer.run();
  const chunkMap = lexer.getChunkMap();

  const parser = new BrambleFSParser(chunkMap);
  parser.run();

  const fsJSON = parser.getJSON();

  expect(fsJSON).toEqual([
    {
      id: "f1a7e",
      type: "file",
      parent: "92e1f",
      name: "logo.png",
      size: 20320,
      tags: [
        {
          name: "branding",
          color: "#000000"
        },
        {
          name: "logo",
          color: "#ffffff"
        }
      ],
      metadata: {
        modified: "20240812T1419",
        created: "20240712T1419",
        mimetype: "image/png",
      },
    }, {
      id: "92e1f",
      type: "directory",
      parent: "root",
      name: "images",
    }
  ]);
});
