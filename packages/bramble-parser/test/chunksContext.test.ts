import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { BrambleLexer } from '../src/lexer/brambleLexer';
import * as fs from 'fs';

describe('Grouping of chunks by contexts', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('Correctly groups a chunk of files', () => {
    const fakeContent = `
#CHUNK files 0-999 @0
FILE f1a7e parent=92e1f name=logo.png size=20320 tags=branding,logo
META f1a7e modified=1723472381 created=1723472370 mimetype=image/png
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    expect(lexer.chunks.length).toBe(1);
    expect(lexer.chunks[0].type).toBe('files');
    expect(lexer.chunks[0].lines.length).toBe(2);
  });

  test('Correctly groups a chunk of directories', () => {
    const fakeContent = `
#CHUNK directories @25000
DIR 92e1f parent=root name=images
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    expect(lexer.chunks.length).toBe(1);
    expect(lexer.chunks[0].type).toBe('directories');
    expect(lexer.chunks[0].lines.length).toBe(1);
  });

  test('Correctly groups a chunk of references', () => {
    const fakeContent = `
#CHUNK refs @27000
REF f1a7e to=3d93e type=used-by context=thumbnail
REF f1a7f to=3d99f type=linked-to
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    expect(lexer.chunks.length).toBe(1);
    expect(lexer.chunks[0].type).toBe('refs');
    expect(lexer.chunks[0].lines.length).toBe(2);
  });

  test('Correctly groups a chunk of history', () => {
    const fakeContent = `
#CHUNK history f1a7e
HIST f1a7e 20250625T1230 user=ellie action=created hash=abc123
HIST f1a7e 20250626T1010 user=ellie action=edited hash=def456
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    expect(lexer.chunks.length).toBe(1);
    expect(lexer.chunks[0].type).toBe('history');
    expect(lexer.chunks[0].lines.length).toBe(2);
  });

});
