import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { BrambleLexer } from '../src/lexer/brambleLexer';
import * as fs from 'fs';
import { ChunkParser } from '~/parser/chunkParser';

describe('Hash verification between files', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('Does not throw an error if FILE and META have the same hash', () => {
    const fakeContent = `
#CHUNK files
FILE f1a7e parent=92e1f name=logo.png
META f1a7e modified=1723472381 created=1723472370 mimetype=image/png
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    expect(() => lexer.checkHashReferencesBetweenFiles()).not.toThrow();
  });

  test('Throws an error if FILE and META have different hashes', () => {
    const fakeContent = `
#CHUNK files
FILE f1a7e parent=92e1f name=logo.png
META xx999 modified=1723472381 created=1723472370 mimetype=image/png
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    expect(() => lexer.checkHashReferencesBetweenFiles()).toThrow(/Mismatch between FILE and META hashes/);
  });

  test('Throws an error if META is missing after FILE', () => {
    const fakeContent = `
#CHUNK files
FILE f1a7e parent=92e1f name=logo.png
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    expect(() => lexer.checkHashReferencesBetweenFiles()).toThrow(/Missing META for file f1a7e/);
  });

  test('Does not throw an error if the history chunk has the correct hash', () => {
    const fakeContent = `
#CHUNK history f1a7e
HIST f1a7e 20250625T1230 user=ellie action=created hash=abc123
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    expect(() => lexer.checkHashReferencesBetweenFiles()).not.toThrow();
  });

  test('throws if token at index is missing', () => {
    const tokens: ILexerToken[] = [];

    expect(() =>
      ChunkParser['getStringTokenAt'](tokens, 0, 'empty tokens')
    ).toThrow('Missing token at index 0 in empty tokens');
  });

  test('Throws an error if the history chunk has an incorrect hash', () => {
    const fakeContent = `
#CHUNK history f1a7e
HIST xxxxxx 20250625T1230 user=ellie action=created hash=abc123
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    expect(() => lexer.checkHashReferencesBetweenFiles()).toThrow("Expected ID token at index 2 at line 2 in hash references, but got STRING: xxxxxx");
  });

});
