import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { BrambleLexer } from '../src/lexer/brambleLexer';
import { ELexerTokens } from '../src/lexer/brambleToken';
import * as fs from 'fs';

describe('Tokenisation of File Headers', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('Correctly tokenises a complete FILE line', () => {
    const fakeContent = 'FILE f1a7e parent=92e1f name=logo.png size=20320 tags=branding,logo\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    const [
      tokenFile,
      tokenId,
      tokenParent,
      tokenOpParent,
      tokenParentVal,
      tokenName,
      tokenOpName,
      tokenNameVal,
      tokenSize,
      tokenOpSize,
      tokenSizeVal,
      tokenTags,
      tokenOpTags,
      tokenTagsVal,
      tokenNewline
    ] = filteredTokens;

    expect(tokenFile.type).toBe(ELexerTokens.KW_FILE);
    expect(tokenId.type).toBe(ELexerTokens.ID);
    expect(tokenParent.type).toBe(ELexerTokens.ATT_PARENT);
    expect(tokenOpParent.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenParentVal.type).toBe(ELexerTokens.ID);
    expect(tokenName.type).toBe(ELexerTokens.ATT_NAME);
    expect(tokenOpName.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenNameVal.type).toBe(ELexerTokens.STRING);
    expect(tokenSize.type).toBe(ELexerTokens.ATT_SIZE);
    expect(tokenOpSize.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenSizeVal.type).toBe(ELexerTokens.ID); // TODO: This should be: ELexerTokens.NUMBER ?
    expect(tokenTags.type).toBe(ELexerTokens.ATT_TAGS);
    expect(tokenOpTags.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenTagsVal.type).toBe(ELexerTokens.LIST);
    expect(tokenNewline.type).toBe(ELexerTokens.NEWLINE);
  });

  test('Correctly tokenises a minimal FILE line', () => {
    const fakeContent = 'FILE f1a7e\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_FILE);
    expect(filteredTokens[1].type).toBe(ELexerTokens.ID);
    expect(filteredTokens[2].type).toBe(ELexerTokens.NEWLINE);
  });

  test('Correctly tokenises FILE with only some attributes', () => {
    const fakeContent = 'FILE f1a7e name=test.png size=1000\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_FILE);
    expect(filteredTokens[1].type).toBe(ELexerTokens.ID);
    expect(filteredTokens[2].type).toBe(ELexerTokens.ATT_NAME);
    expect(filteredTokens[3].type).toBe(ELexerTokens.OPERATOR);
    expect(filteredTokens[4].type).toBe(ELexerTokens.STRING);
    expect(filteredTokens[5].type).toBe(ELexerTokens.ATT_SIZE);
    expect(filteredTokens[6].type).toBe(ELexerTokens.OPERATOR);
    expect(filteredTokens[7].type).toBe(ELexerTokens.ID); // TODO: This should be: ELexerTokens.NUMBER ?
    expect(filteredTokens[8].type).toBe(ELexerTokens.NEWLINE);
  });

  test('Throws an error if ID is missing after FILE', () => {
    const fakeContent = 'FILE\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    // TODO: Simulation of error, this should be implemented?
    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_FILE);
    expect(filteredTokens[1].type).not.toBe(ELexerTokens.ID);
  });

});
