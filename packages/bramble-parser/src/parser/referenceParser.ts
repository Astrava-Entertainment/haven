import { ELexerTokens, ErrorCode } from '~/common';
import { BaseParser } from './baseParser';
import { HavenException } from '~/errors';

export class ReferenceParser extends BaseParser {
  references: HavenReference[];
  nodes: HavenFSNode[];

  constructor(references: HavenReference[], nodes: HavenFSNode[], entries: ILexerToken[][]) {
    super(entries);
    this.nodes = nodes;
    this.references = references;
    this.parse();
  }

  parse(): void {
    for (const line of this.entries) {
      const first = line[0];
      const position = this.getPosition(first);

      const fromIdToken = this.getFromIdToken(line);
      const toToken = this.getTokenValueAt(line, ELexerTokens.ATT_TO);
      const typeToken = this.getTokenValueAt(line, ELexerTokens.ATT_TYPE);
      const contextToken = this.getTokenValueAt(line, ELexerTokens.ATT_CONTEXT, true);

      if (!fromIdToken || !toToken || !typeToken) {
        new HavenException('Missing mandatory fields in FILE', position, ErrorCode.MISSING_TOKEN);
        continue;
      }

      if (this.isTokenInvalid(toToken) || this.isTokenInvalid(typeToken)) {
        new HavenException('Missing mandatory reference field', position, ErrorCode.MISSING_TOKEN);
        continue;
      }
      
      if (!this.hasFileById(fromIdToken.value)) {
        new HavenException(`Missing FILE: ${fromIdToken.value}`, position, ErrorCode.MISSING_TOKEN);
        continue;
      }

      if (!this.hasFileById(toToken)) {
        new HavenException(`Missing FILE: ${toToken}`, position, ErrorCode.MISSING_TOKEN);
        continue;
      }

      this.references.push(this.createReference(fromIdToken.value, toToken, typeToken, contextToken));
    }
  }


  private hasFileById(id: string): boolean {
    return this.nodes.some((node) => node.type === 'file' && node.id === id);
  }

  private getFromIdToken(line: ILexerToken[]): ILexerToken | undefined {
    return line.find(t => t.type === ELexerTokens.ID);
  }

  private getTokenValueAt(line: ILexerToken[], tokenType: ELexerTokens, optional = false): string | undefined {
    const index = line.findIndex(t => t.type === tokenType);
    if (index === -1) return optional ? undefined : '';
    return line[index + 2]?.value;
  }

  private isTokenInvalid(value: string): boolean {
    return !value || value.trim() === '';
  }

  private getPosition(first: ILexerToken | undefined): { line: number; column: number } {
    return {
      line: first?.line ?? 0,
      column: first?.start ?? 0,
    };
  }

  private createReference(from: string, to: string, type: string, context?: string): HavenReference {
    return { from, to, type, context };
  }
}
