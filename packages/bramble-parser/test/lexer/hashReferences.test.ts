import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { BrambleLexer } from '../../src/lexer/brambleLexer';
import * as fs from 'fs';
import { ChunkParser } from '~/parser/chunkParser';
import { errorManager } from '~/errors/errorManager';

describe('Hash verification between files', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
    errorManager.clear(); // limpiar errores antes de cada test
  });

  test('Does not report an error if FILE and META have the same hash', () => {
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

    lexer.checkHashReferencesBetweenFiles();

    expect(errorManager.getAll().length).toBe(0);
  });

  test('Reports an error if FILE and META have different hashes', () => {
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

    lexer.checkHashReferencesBetweenFiles();

    const errors = errorManager.getAll();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/Mismatch between FILE and META hashes/);
  });

  test('Reports an error if META is missing after FILE', () => {
    const fakeContent = `
#CHUNK files
FILE f1a7e parent=92e1f name=logo.png
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    lexer.checkHashReferencesBetweenFiles();

    const errors = errorManager.getAll();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/Missing META for file f1a7e/);
  });

  test('Does not report an error if the history chunk has the correct hash', () => {
    const fakeContent = `
#CHUNK history f1a7e
HIST f1a7e 20250625T1230 user=ellie action=created hash=abc123
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    lexer.checkHashReferencesBetweenFiles();

    expect(errorManager.getAll().length).toBe(0);
  });

  test('reports an error if token at index is missing', () => {
    const tokens: ILexerToken[] = [];

    const result = ChunkParser['getStringTokenAt'](tokens, 0, 'empty tokens');

    expect(result).not.toBeNull();

    const errors = errorManager.getAll();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe('Missing token at index 0 in empty tokens');
  });


  test('Reports an error if the history chunk has an incorrect hash', () => {
    const fakeContent = `
#CHUNK history f1a7e
HIST xxxxxx 20250625T1230 user=ellie action=created hash=abc123
`.trim();

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();
    lexer.groupTokensByLine();
    lexer.groupByChunkContext();

    lexer.checkHashReferencesBetweenFiles();

    const errors = errorManager.getAll();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/Expected ID token at index 2 in hash references, but got STRING: xxxxxx/);
  });

});
