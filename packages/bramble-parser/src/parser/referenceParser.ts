import { ELexerTokens, ErrorCode } from '~/common';
import { BaseParser } from './baseParser';
import { HavenException } from '~/errors';
import { errorManager } from '~/errors/errorManager';

export class ReferenceParser extends BaseParser {
  references: HavenReference[];

  constructor(references: HavenReference[], entries: ILexerToken[][]) {
    super(entries);
    this.references = references;
    this.parse();
  }

  parse(): void {
    for (const line of this.entries) {
      const first = line[0];

      const fromIdToken = line.find((t) => t.type === ELexerTokens.ID);
      const toIndex = line.findIndex((t) => t.type === ELexerTokens.ATT_TO);
      const typeIndex = line.findIndex((t) => t.type === ELexerTokens.ATT_TYPE);
      const contextIndex = line.findIndex((t) => t.type === ELexerTokens.ATT_CONTEXT);

      if (!fromIdToken || typeIndex === -1 || toIndex === -1) {
        const position = { line: first?.line ?? 0, column: first?.start ?? 0 };
        new HavenException('Missing mandatory fields in FILE', position, ErrorCode.MISSING_TOKEN);
        continue;
      }

      const toToken = line[toIndex + 2]?.value;
      const typeToken = line[typeIndex + 2]?.value;
      const contextToken = contextIndex !== -1 ? line[contextIndex + 2]?.value : undefined;

      if (!toToken || !typeToken) {
        const position = { line: first?.line ?? 0, column: first?.start ?? 0 };
        new HavenException('Missing mandatory reference field', position, ErrorCode.MISSING_TOKEN);
        continue;
      }

      if (toToken === ' ' || typeToken === ' ') {
        const position = { line: first?.line ?? 0, column: first?.start ?? 0 };
        new HavenException('Missing mandatory reference field', position, ErrorCode.MISSING_TOKEN);
        continue;
      }

      const refNode: HavenReference = {
        from: fromIdToken.value,
        to: toToken,
        type: typeToken,
        context: contextToken,
      };

      this.references.push(refNode);
    }
  }
}
