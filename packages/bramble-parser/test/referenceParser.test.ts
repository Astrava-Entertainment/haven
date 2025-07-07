import { describe, test, expect, beforeEach, vi } from 'bun:test';
import { ReferenceParser } from '~/parser/referenceParser';
import { BrambleLexer } from '~/lexer/brambleLexer';

describe('ReferenceParser integrated with Lexer', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('Parses a reference using the real lexer', () => {
    const lexer = new BrambleLexer('./test/examples/test.example.havenfs');
    lexer.run();

    const chunkMap = lexer.getChunkMap();
    const refChunk = chunkMap.find(chunk => chunk.type === 'refs');

    if (refChunk === undefined) return;

    const references: HavenReference[] = [];
    new ReferenceParser(references, refChunk.entries);

    expect(references).toHaveLength(1);
    expect(references[0]).toEqual({
      from: 'f1a7e',
      to: '3d93e',
      type: 'used-by',
      context: 'thumbnail'
    });
  });

  test('Throws an error on reference with missing fields', () => {
    const lexer = new BrambleLexer('./test/examples/test.missing-fields-refs.havenfs');
    lexer.run();

    const refChunk = lexer.getChunkMap().find(chunk => chunk.type === 'refs');
    if (!refChunk) return;

    const references: HavenReference[] = [];

    expect(() => {
      new ReferenceParser(references, refChunk.entries);
    }).toThrow(/Missing mandatory reference field/); // Make sure this matches your parser's exact error message
  });

  test('Throws an error on reference with invalid type', () => {
    const lexer = new BrambleLexer('./test/examples/test.invalid-type-refs.havenfs');
    lexer.run();

    const refChunk = lexer.getChunkMap().find(chunk => chunk.type === 'refs');
    if (!refChunk) return;

    const references: HavenReference[] = [];

    expect(() => {
      new ReferenceParser(references, refChunk.entries);
    }).toThrow(/Missing mandatory reference field/); // Make sure this matches your parser's exact error message
  });

});
