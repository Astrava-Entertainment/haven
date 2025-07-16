import * as fs from 'fs';
import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { ELexerTokens } from '~/common';
import { BrambleLexer } from '~/lexer/brambleLexer';
import { errorManager } from '~/errors/errorManager';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) =>
  join(__dirname, '..', 'examples', name);

describe('Tokenisation of Chunk Headers', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
    errorManager.clear();
  });

  test('Correctly tokenises a valid chunk', () => {
    const lexer = new BrambleLexer(fixture('test.example.havenfs'));
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens.length).toBeGreaterThan(0);

    const [tokenHash, tokenChunk, tokenString] = filteredTokens;

    expect(tokenHash.type).toBe(ELexerTokens.HASH);
    expect(tokenHash.value).toBe('#');

    expect(tokenChunk.type).toBe(ELexerTokens.KW_CHUNK);
    expect(tokenChunk.value.toLowerCase()).toBe('chunk');

    expect(tokenString.type).toBe(ELexerTokens.STRING);
    expect(tokenString.value).toBe('files');
  });

  test('Reports an error if an unrecognised token is found', () => {
    const fakeContent = '@@@ error?';

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer(fixture('test.example.havenfs'));
    lexer.tokenize();

    const errors = errorManager.getAll();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/Unrecognized token/);
  });

});
