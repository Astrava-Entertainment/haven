import { ELexerTokens, ErrorCode } from '~/common';
import { BaseParser } from './baseParser';
import { HavenException } from '~/errors';
import { errorManager } from '~/errors/errorManager';

export class DirectoryParser extends BaseParser {
  nodes: HavenFSNode[];

  constructor(nodes: HavenFSNode[], entries: ILexerToken[][]) {
    super(entries);
    this.nodes = nodes;
    this.parse();
  }

  parse(): void {
    for (const line of this.entries) {
      const first = line[0];

      const idToken = line.find((t) => t.type === ELexerTokens.ID);
      const parentIndex = line.findIndex((t) => t.type === ELexerTokens.ATT_PARENT);
      const nameIndex = line.findIndex((t) => t.type === ELexerTokens.ATT_NAME);

      if (!idToken || parentIndex === -1 || nameIndex === -1) {
        const position = { line: first?.line ?? 0, column: first?.start ?? 0 };
        new HavenException('Missing mandatory fields in FILE', position, ErrorCode.MISSING_TOKEN);
        continue;
      }

      const parentToken = line[parentIndex + 2]?.value;
      const nameToken = line[nameIndex + 2]?.value;

      const dirNode: HavenFSNode = {
        id: idToken.value,
        type: 'directory',
        parent: parentToken,
        name: nameToken,
      };

      this.nodes.push(dirNode);
    }
  }
}
