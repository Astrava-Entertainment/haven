import { ELexerTokens, ErrorCode } from "~/common";
import { BaseParser } from "./baseParser";
import { HavenException } from "~/errors";

export class HistoryParser extends BaseParser {
  history: HavenHistoryTree[]

  constructor(history: HavenHistoryTree[], entries: ILexerToken[][]) {
    super(entries);
    this.history = history;
    this.parse()
  }

  parse(): void {
    for (const line of this.entries) {
      const first = line[0];

      const idToken = line.find(t => t.type === ELexerTokens.ID);
      const timestampToken = line.find(t => t.type === ELexerTokens.TIMESTAMP);
      const userIndex = line.findIndex(t => t.type === ELexerTokens.ATT_USER);
      const actionIndex = line.findIndex(t => t.type === ELexerTokens.ATT_ACTION);
      const hashIndex = line.findIndex(t => t.type === ELexerTokens.ATT_HASH);


      if (!idToken || !timestampToken || userIndex === -1 || actionIndex === -1 || hashIndex === -1) {
        throw new HavenException('Missing mandatory fields in FILE', first.line, first.start, ErrorCode.MISSING_TOKEN);
      }

      const userToken = line[userIndex + 2]?.value;
      const actionToken = line[actionIndex + 2]?.value;
      const hashToken = line[hashIndex + 2]?.value;

      const historyNode: HavenHistoryTree = {
        id: idToken.value,
        timestamp: timestampToken.value,
        user: userToken,
        action: actionToken,
        hash: hashToken,
      }

      this.history.push(historyNode);
    }
  }
}
