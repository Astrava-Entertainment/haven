import { describe, test, expect } from 'bun:test';
import { HavenException } from "~/errors";
import { ELexerTokens, ErrorCode } from "~/common";
import { tryExtractChunkType } from '~/utils';

describe("tryExtractChunkType", () => {
  test("returns chunk type if tokens are valid", () => {
    const tokens = [
      { type: ELexerTokens.OPERATOR, value: "#", start: 0, line: 1 },
      { type: ELexerTokens.KW_CHUNK, value: "CHUNK", start: 1, line: 1 },
      { type: ELexerTokens.WHITESPACE, value: " ", start: 6, line: 1 },
      { type: ELexerTokens.STRING, value: "files", start: 7, line: 1 }
    ];

    const result = tryExtractChunkType(tokens as ILexerToken[], 0);
    expect(result).toBe("files");
  });

  test("throws HavenException if first keyword is not KW_CHUNK", () => {
    const tokens = [
      { type: ELexerTokens.OPERATOR, value: "#", start: 0, line: 1 },
      { type: ELexerTokens.STRING, value: "NOTCHUNK", start: 1, line: 1 }
    ];

    expect(() => {
      tryExtractChunkType(tokens as ILexerToken[], 0);
    }).toThrow(HavenException);

    try {
      tryExtractChunkType(tokens as ILexerToken[], 0);
    } catch (e) {
      const ex = e as HavenException;
      expect(ex.code).toBe(ErrorCode.INVALID_CHUNK_DECLARATION);
      expect(ex.position.line).toBe(1);
      expect(ex.position.column).toBe(1);
    }
  });

  test("throws HavenException if chunk type token is missing", () => {
    const tokens = [
      { type: ELexerTokens.OPERATOR, value: "#", start: 0, line: 1 },
      { type: ELexerTokens.KW_CHUNK, value: "CHUNK", start: 1, line: 1 }
    ];

    expect(() => {
      tryExtractChunkType(tokens as ILexerToken[], 0);
    }).toThrow(HavenException);

    try {
      tryExtractChunkType(tokens as ILexerToken[], 0);
    } catch (e) {
      const ex = e as HavenException;
      expect(ex.code).toBe(ErrorCode.MISSING_CHUNK_TYPE);
      expect(ex.position.line).toBe(1);
    }
  });

  test("throws HavenException if chunk type token is not STRING", () => {
    const tokens = [
      { type: ELexerTokens.OPERATOR, value: "#", start: 0, line: 1 },
      { type: ELexerTokens.KW_CHUNK, value: "CHUNK", start: 1, line: 1 },
      { type: ELexerTokens.WHITESPACE, value: " ", start: 6, line: 1 },
      { type: ELexerTokens.ID, value: "files", start: 7, line: 1 }
    ];

    expect(() => {
      tryExtractChunkType(tokens as ILexerToken[], 0);
    }).toThrow(HavenException);

    try {
      tryExtractChunkType(tokens as ILexerToken[], 0);
    } catch (e) {
      const ex = e as HavenException;
      expect(ex.code).toBe(ErrorCode.MISSING_CHUNK_TYPE);
    }
  });
});
