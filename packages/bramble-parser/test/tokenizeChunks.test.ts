import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { BrambleLexer } from '../src/lexer/brambleLexer';
import { ELexerTokens } from '../src/lexer/brambleToken';
import * as fs from 'fs';

describe('Tokenisation of Chunk Headers', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('Correctly tokenises a valid chunk', () => {
    const lexer = new BrambleLexer('./test/test.example.havenfs');
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

  test('Throws an error if an unrecognised token is found', () => {
    const fakeContent = '@@@ error?';

    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');

    expect(() => lexer.tokenize()).toThrow(/Unrecognized token/);
  });

});
