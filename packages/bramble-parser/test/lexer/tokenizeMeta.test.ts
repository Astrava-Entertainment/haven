import * as fs from 'fs';
import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { BrambleLexer } from '~/lexer/brambleLexer';
import { ELexerTokens } from '~/common';

describe('Tokenisation of META Headers', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('Correctly tokenises a complete META line', () => {
    const fakeContent = 'META f1a7e modified=1723472381 created=1723472370 mimetype=image/png\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    const [
      tokenMeta,
      tokenId,
      tokenModified,
      tokenOpModified,
      tokenModifiedVal,
      tokenCreated,
      tokenOpCreated,
      tokenCreatedVal,
      tokenMimetype,
      tokenOpMimetype,
      tokenMimetypeVal,
      tokenNewline
    ] = filteredTokens;

    expect(tokenMeta.type).toBe(ELexerTokens.KW_META);
    expect(tokenId.type).toBe(ELexerTokens.ID);
    expect(tokenModified.type).toBe(ELexerTokens.ATT_MODIFIED);
    expect(tokenOpModified.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenModifiedVal.type).toBe(ELexerTokens.ID);
    expect(tokenCreated.type).toBe(ELexerTokens.ATT_CREATED);
    expect(tokenOpCreated.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenCreatedVal.type).toBe(ELexerTokens.ID);
    expect(tokenMimetype.type).toBe(ELexerTokens.ATT_MIMETYPE);
    expect(tokenOpMimetype.type).toBe(ELexerTokens.OPERATOR);
    expect(tokenMimetypeVal.type).toBe(ELexerTokens.MIME_TYPE);
    expect(tokenNewline.type).toBe(ELexerTokens.NEWLINE);
  });

  test('Correctly tokenises a minimal META line', () => {
    const fakeContent = 'META f1a7e\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_META);
    expect(filteredTokens[1].type).toBe(ELexerTokens.ID);
    expect(filteredTokens[2].type).toBe(ELexerTokens.NEWLINE);
  });

  test('Issues a warning if ID is missing after META', () => {
    const fakeContent = 'META\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    lexer.tokenize();

    const filteredTokens = lexer.tokens.filter(t => t.type !== ELexerTokens.WHITESPACE);

    expect(filteredTokens[0].type).toBe(ELexerTokens.KW_META);
    expect(filteredTokens[1].type).toBe(ELexerTokens.NEWLINE);
  });

});
