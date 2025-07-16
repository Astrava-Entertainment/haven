import { describe, test, expect, beforeEach, vi } from 'bun:test';
import { ReferenceParser } from '~/parser/referenceParser';
import { BrambleLexer } from '~/lexer/brambleLexer';
import { errorManager } from '~/errors/errorManager';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) =>
  join(__dirname, '..', 'examples', name);
describe('ReferenceParser integrated with Lexer', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
    errorManager.clear();
  });

  test('Parses a reference using the real lexer', () => {
    const lexer = new BrambleLexer({document: fixture('test.example.havenfs')});
    lexer.run();

    const chunkMap = lexer.getChunkMap();
    const refChunk = chunkMap.find(chunk => chunk.type === 'refs');

    if (refChunk === undefined) return;

    const references: HavenReference[] = [];
    new ReferenceParser(references, refChunk.entries);

    expect(errorManager.getAll().length).toBe(0);
    expect(references).toHaveLength(1);
    expect(references[0]).toEqual({
      from: 'f1a7e',
      to: '3d93e',
      type: 'used-by',
      context: 'thumbnail'
    });
  });

  test('Reports an error on reference with missing fields', () => {
    const lexer = new BrambleLexer({document: fixture('test.missing-fields-refs.havenfs')});
    lexer.run();

    const refChunk = lexer.getChunkMap().find(chunk => chunk.type === 'refs');
    if (!refChunk) return;

    const references: HavenReference[] = [];

    new ReferenceParser(references, refChunk.entries);

    const errors = errorManager.getAll();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/Missing mandatory reference field/);
  });

  test('Reports an error on reference with invalid type', () => {
    const lexer = new BrambleLexer({document: fixture('test.invalid-type-refs.havenfs')});
    lexer.run();

    const refChunk = lexer.getChunkMap().find(chunk => chunk.type === 'refs');
    if (!refChunk) return;

    const references: HavenReference[] = [];

    new ReferenceParser(references, refChunk.entries);

    const errors = errorManager.getAll();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/Missing mandatory reference field/);
  });

});
