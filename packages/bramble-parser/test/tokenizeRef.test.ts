import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { BrambleLexer } from '../src/lexer/brambleLexer';
import { ELexerTokens } from '../src/lexer/brambleToken';
import * as fs from 'fs';

describe('Tokenisation of REF Headers', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('Correctly tokenises a complete REF line', () => {
    const fakeContent = 'REF f1a7e to=3d93e type=used-by context=thumbnail\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    const [
      tokenRef,
      tokenId,
      tokenTo,
      tokenOpTo,
      tokenToVal,
      tokenType,
      tokenOpType,
      tokenTypeVal,
      tokenContext,
      tokenOpContext,
      tokenContextVal,
      tokenNewline
    ] = filteredTokens;

    expect(tokenRef.type).toBe(ELexerTokens.KW_REF);
    expect(tokenId.type).toBe(ELexerTokens.ID);
    expect(tokenTo.type).toBe(ELexerTokens.ATT_TO);
    expect(tokenOpTo.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenToVal.type).toBe(ELexerTokens.ID);
    expect(tokenType.type).toBe(ELexerTokens.ATT_TYPE);
    expect(tokenOpType.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenTypeVal.type).toBe(ELexerTokens.STRING);
    expect(tokenContext.type).toBe(ELexerTokens.ATT_CONTEXT);
    expect(tokenOpContext.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenContextVal.type).toBe(ELexerTokens.STRING);
    expect(tokenNewline.type).toBe(ELexerTokens.NEWLINE);
  });

  test('Correctly tokenises a minimal REF line', () => {
    const fakeContent = 'REF f1a7e\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_REF);
    expect(filteredTokens[1].type).toBe(ELexerTokens.ID);
    expect(filteredTokens[2].type).toBe(ELexerTokens.NEWLINE);
  });

  test('Detects absence of ID after REF', () => {
    const fakeContent = 'REF\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_REF);
    expect(filteredTokens[1].type).toBe(ELexerTokens.NEWLINE);  // No ID present
  });

});
