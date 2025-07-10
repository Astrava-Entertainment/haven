import { ELexerTokens, ErrorCode } from '~/common';
import { BaseParser } from './baseParser';
import { HavenException } from '~/errors';
import { AllowedActions } from '~/constants';
import { errorManager } from '~/errors/errorManager';

export class HistoryParser extends BaseParser {
  history: HavenHistoryTree[];

  constructor(history: HavenHistoryTree[], entries: ILexerToken[][]) {
    super(entries);
    this.history = history;
    this.parse();
  }

  parse(): void {
    for (const line of this.entries) {
      const first = line[0];

      const idToken = line.find((t) => t.type === ELexerTokens.ID);
      const timestampToken = line.find((t) => t.type === ELexerTokens.TIMESTAMP);
      const userIndex = line.findIndex((t) => t.type === ELexerTokens.ATT_USER);
      const actionIndex = line.findIndex((t) => t.type === ELexerTokens.ATT_ACTION);
      const hashIndex = line.findIndex((t) => t.type === ELexerTokens.ATT_HASH);

      if (!idToken || !timestampToken || userIndex === -1 || actionIndex === -1 || hashIndex === -1) {
        const position = { line: first.line, column: first.start };
        new HavenException('Missing mandatory fields in FILE', position, ErrorCode.MISSING_TOKEN);
        return;
      }

      const userToken = line[userIndex + 2]?.value;
      const actionToken = line[actionIndex + 2]?.value;
      const hashToken = line[hashIndex + 2]?.value;

      if (!AllowedActions.includes(actionToken)) {
        const position = { line: line[actionIndex + 2].line, column: line[actionIndex + 2].start };
        new HavenException(`Invalid action: ${actionToken}`, position, ErrorCode.INVALID_HISTORY_ACTION);
        return;
      }

      const historyNode: HavenHistoryTree = {
        id: idToken.value,
        timestamp: timestampToken.value,
        user: userToken,
        action: actionToken,
        hash: hashToken,
      };

      this.history.push(historyNode);
    }
  }
}
