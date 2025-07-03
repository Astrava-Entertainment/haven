import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { BrambleLexer } from '../src/lexer/brambleLexer';
import { ELexerTokens } from '../src/lexer/brambleToken';
import * as fs from 'fs';

describe('Tokenisation of DIR Headers', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('Correctly tokenises a complete DIR line', () => {
    const fakeContent = 'DIR 92e1f parent=root name=images\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    const [
      tokenDir,
      tokenId,
      tokenParent,
      tokenOpParent,
      tokenParentVal,
      tokenName,
      tokenOpName,
      tokenNameVal,
      tokenNewline
    ] = filteredTokens;

    expect(tokenDir.type).toBe(ELexerTokens.KW_DIR);
    expect(tokenId.type).toBe(ELexerTokens.ID);
    expect(tokenParent.type).toBe(ELexerTokens.ATT_PARENT);
    expect(tokenOpParent.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenParentVal.type).toBe(ELexerTokens.ROOT);
    expect(tokenName.type).toBe(ELexerTokens.ATT_NAME);
    expect(tokenOpName.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenNameVal.type).toBe(ELexerTokens.STRING);
    expect(tokenNewline.type).toBe(ELexerTokens.NEWLINE);
  });

  test('Tokenises a minimal DIR line', () => {
    const fakeContent = 'DIR 92e1f\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_DIR);
    expect(filteredTokens[1].type).toBe(ELexerTokens.ID);
    expect(filteredTokens[2].type).toBe(ELexerTokens.NEWLINE);
  });

  test('Detects absence of ID after DIR', () => {
    const fakeContent = 'DIR\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_DIR);
    expect(filteredTokens[1].type).toBe(ELexerTokens.NEWLINE);  // No ID present
  });

});
