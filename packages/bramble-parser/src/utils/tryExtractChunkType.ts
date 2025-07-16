import { ELexerTokens, ErrorCode } from '~/common';
import { CHUNK_DECLARATION_INDEX, CHUNK_TYPE_INDEX } from '~/constants';
import { HavenException } from '~/errors';

export function tryExtractChunkType(token: ILexerToken[], index: number) {
  const keywordToken = token[CHUNK_DECLARATION_INDEX];
  if (keywordToken.type !== ELexerTokens.KW_CHUNK) {
    const position = { line: index + 1, column: keywordToken.start };
    throw new HavenException('Invalid chunk declaration', position, ErrorCode.INVALID_CHUNK_DECLARATION);
    return;
  }

  const chunkTypeToken = token[CHUNK_TYPE_INDEX];
  if (!chunkTypeToken || chunkTypeToken.type !== ELexerTokens.STRING) {
    const position = { line: index + 1, column: keywordToken.start };
    throw new HavenException('Missing chunk type', position, ErrorCode.MISSING_CHUNK_TYPE);
    return;
  }

  return chunkTypeToken.value;
}
