import * as fs from 'fs';
import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { ELexerTokens } from '~/common';
import { BrambleLexer } from '~/lexer/brambleLexer';

describe('Tokenisation of HIST Headers', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('Correctly tokenises a complete HIST line', () => {
    const fakeContent = 'HIST f1a7e 20250625T1230 user=ellie action=created hash=abc123\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    const [
      tokenHist,
      tokenId,
      tokenTimestamp,
      tokenUser,
      tokenOpUser,
      tokenUserVal,
      tokenAction,
      tokenOpAction,
      tokenActionVal,
      tokenHashAttr,
      tokenOpHash,
      tokenHashVal,
      tokenNewline
    ] = filteredTokens;

    console.log(ELexerTokens[tokenActionVal.type]);

    expect(tokenHist.type).toBe(ELexerTokens.KW_HIST);
    expect(tokenId.type).toBe(ELexerTokens.ID);
    expect(tokenTimestamp.type).toBe(ELexerTokens.TIMESTAMP);
    expect(tokenUser.type).toBe(ELexerTokens.ATT_USER);
    expect(tokenOpUser.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenUserVal.type).toBe(ELexerTokens.STRING);
    expect(tokenAction.type).toBe(ELexerTokens.ATT_ACTION);
    expect(tokenOpAction.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenActionVal.type).toBe(ELexerTokens.ATT_CREATED);
    expect(tokenHashAttr.type).toBe(ELexerTokens.ATT_HASH);
    expect(tokenOpHash.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenHashVal.type).toBe(ELexerTokens.ID);
    expect(tokenNewline.type).toBe(ELexerTokens.NEWLINE);
  });

  test('Correctly tokenises a minimal HIST line', () => {
    const fakeContent = 'HIST f1a7e 20250625T1230\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_HIST);
    expect(filteredTokens[1].type).toBe(ELexerTokens.ID);
    expect(filteredTokens[2].type).toBe(ELexerTokens.TIMESTAMP);
    expect(filteredTokens[3].type).toBe(ELexerTokens.NEWLINE);
  });

  test('Detects absence of ID after HIST', () => {
    const fakeContent = 'HIST\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_HIST);
    expect(filteredTokens[1].type).toBe(ELexerTokens.NEWLINE);  // No ID present
  });

});
