import { describe, test, expect } from 'bun:test';
import { BrambleLexer } from '~/lexer/brambleLexer';
import { DirectorieParser } from '~/parser/directoryParser';

describe('DirectorieParser integrated with Lexer', () => {

  test('Parses a complete DIRECTORY node using the real lexer', () => {
    const lexer = new BrambleLexer('./test/examples/test.directory.example.havenfs');
    lexer.run();

    const dirChunk = lexer.getChunkMap().find(chunk => chunk.type === 'directories');
    if (dirChunk === undefined) return;

    const entries = dirChunk.entries;

    const nodes: HavenFSNode[] = [];
    new DirectorieParser(nodes, entries);

    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toEqual({
      id: 'd92f1',
      type: 'directory',
      parent: 'root',
      name: 'assets'
    });
  });

  test('Supports multiple DIRECTORY nodes within a single chunk', () => {
    const lexer = new BrambleLexer('./test/examples/test.multiple.directory.example.havenfs');
    lexer.run();

    const dirChunk = lexer.getChunkMap().find(chunk => chunk.type === 'directories');
    if (dirChunk === undefined) return;

    const entries = dirChunk.entries;

    const nodes: HavenFSNode[] = [];
    new DirectorieParser(nodes, entries);

    expect(nodes).toHaveLength(2);

    expect(nodes[0].id).toBe('d92f1');
    expect(nodes[0].name).toBe('assets');

    expect(nodes[1].id).toBe('d93a2');
    expect(nodes[1].name).toBe('images');
  });

  test('Does not create nodes if the directories chunk is empty', () => {
    const lexer = new BrambleLexer('./test/examples/test.empty.directory.example.havenfs');
    lexer.run();

    const dirChunk = lexer.getChunkMap().find(chunk => chunk.type === 'directories');
    if (dirChunk === undefined) return;

    const entries = dirChunk.entries;

    const nodes: HavenFSNode[] = [];
    new DirectorieParser(nodes, entries);

    expect(nodes).toHaveLength(0);
  });

  test('Throws an error if mandatory fields are missing', () => {
    const lexer = new BrambleLexer('./test/examples/test.invalid.directory.example.havenfs');
    lexer.run();

    const dirChunk = lexer.getChunkMap().find(chunk => chunk.type === 'directories');
    if (dirChunk === undefined) return;

    const entries = dirChunk.entries;

    const nodes: HavenFSNode[] = [];

    expect(() => {
      new DirectorieParser(nodes, entries);
    }).toThrowError(/Missing mandatory fields/);
  });

});
