import { describe, test, expect } from 'bun:test';
import { FileParser } from '~/parser/fileParser';
import { BrambleLexer } from '~/lexer/brambleLexer';
import type { HavenFSNode } from '~/model/types';

describe('FileParser integrated with Lexer', () => {

  test('Parses a complete FILE node using the real lexer', () => {
    const lexer = new BrambleLexer('./test/examples/test.example.havenfs');
    lexer.run();

    const fileChunk = lexer.getChunkMap().find(chunk => chunk.type === 'files');
    if (fileChunk === undefined) return;
    const entries = fileChunk.entries;

    const nodes: HavenFSNode[] = [];
    new FileParser(nodes, entries);

    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toEqual({
      id: 'f1a7e',
      type: 'file',
      parent: '92e1f',
      name: 'logo.png',
      size: 20320,
      tags: ['branding', 'logo'],
      metadata: {
        modified: "1723472381",
        created: "1723472370",
        mimetype: 'image/png'
      }
    });
  });

  test('Supports multiple FILE nodes within a single chunk', () => {
    const lexer = new BrambleLexer('./test/examples/test.multiple.example.havenfs');
    lexer.run();

    const fileChunk = lexer.getChunkMap().find(chunk => chunk.type === 'files');
    if (fileChunk === undefined) return;

    const entries = fileChunk.entries;

    const nodes: HavenFSNode[] = [];
    new FileParser(nodes, entries);

    expect(nodes).toHaveLength(3);

    expect(nodes[0].id).toBe('f1a7e');
    expect(nodes[1].id).toBe('f1b88');
    expect(nodes[1].name).toBe('screenshot1.png');
  });

  test('Does not create nodes if the files chunk is empty', () => {
    const lexer = new BrambleLexer('./test/examples/test.empty.example.havenfs');
    lexer.run();

    const fileChunk = lexer.getChunkMap().find(chunk => chunk.type === 'files');
    if (fileChunk === undefined) return;

    const entries = fileChunk.entries;

    const nodes: HavenFSNode[] = [];
    new FileParser(nodes, entries);

    expect(nodes).toHaveLength(0);
  });

});
