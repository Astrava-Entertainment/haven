import { ELexerTokens, ErrorCode } from '~/common';
import { BaseParser } from './baseParser'
import { HavenException } from '~/errors';

export class FileParser extends BaseParser {
  nodes: HavenFSNode[]

  constructor(nodes: HavenFSNode[], entries: ILexerToken[][]) {
    super(entries);
    this.nodes = nodes;
    this.parse()
  }

  parse(): void {
    let lastFileNode: HavenFSNode | undefined;
    for (const line of this.entries) {
      const first = line[0];
      if (first.type === ELexerTokens.KW_FILE) {
        lastFileNode = this.parseFileLine(line, first);
      } else if (first.type === ELexerTokens.KW_META) {
        this.parseMetaLine(lastFileNode, first, line);
      } else {
        throw new HavenException('Unexpected token in files chunk', first.line, first.start, ErrorCode.INVALID_TOKEN_IN_CHUNK);
      }
    }
  }

  parseFileLine(line: ILexerToken[], first: ILexerToken): HavenFSNode {
    const idToken = line.find(t => t.type === ELexerTokens.ID);
    const parentIndex = line.findIndex(t => t.type === ELexerTokens.ATT_PARENT);
    const nameIndex = line.findIndex(t => t.type === ELexerTokens.ATT_NAME);
    const sizeIndex = line.findIndex(t => t.type === ELexerTokens.ATT_SIZE);
    const tagsIndex = line.findIndex(t => t.type === ELexerTokens.ATT_TAGS);

    if (!idToken || parentIndex === -1 || nameIndex === -1) {
      throw new HavenException('Missing mandatory fields in FILE', first.line, first.start, ErrorCode.MISSING_TOKEN);
    }

    const parentToken = line[parentIndex + 2]?.value;
    const nameToken = line[nameIndex + 2]?.value;
    const size = sizeIndex !== -1 ? parseInt(line[sizeIndex + 2]?.value, 10) : undefined;
    const tags = tagsIndex !== -1 ? line[tagsIndex + 2]?.value.split(',') : undefined;

    const fileNode: HavenFSNode = {
      id: idToken.value,
      type: 'file',
      parent: parentToken,
      name: nameToken,
      size: size,
      tags: tags
    };

    this.nodes.push(fileNode);
    return fileNode;
  }

  parseMetaLine(lastFileNode: HavenFSNode | undefined, first: ILexerToken, line: ILexerToken[]) {
    console.log(lastFileNode);

    if (!lastFileNode) {
      throw new HavenException('META without preceding FILE', first.line, first.start, ErrorCode.MISSING_TOKEN);
    }

    const idToken = line.find(t => t.type === ELexerTokens.ID);
    if (!idToken || idToken.value !== lastFileNode.id) {
      throw new HavenException(`META ID does not match last FILE`, first.line, first.start, ErrorCode.INVALID_TOKEN_IN_CHUNK);
    }

    if (!lastFileNode.metadata) {
      lastFileNode.metadata = {};
    }

    // [KW_META] [WHITESPACE] [ID] [WHITESPACE] [ATT_MODIFIED] [OPERATOR] [ID] [WHITESPACE] [ATT_CREATED] [OPERATOR] [ID] [WHITESPACE] [ATT_MIMETYPE] [OPERATOR] [MIME_TYPE]
    for (let i = 4; i < line.length; i += 4) {
      const key = line[i]?.value;
      const value = line[i + 2]?.value;
      if (key && value) {
        lastFileNode.metadata[key] = value;
      }
    }
  }
}
