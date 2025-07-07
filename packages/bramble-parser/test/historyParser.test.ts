import { describe, test, expect, beforeEach, vi } from 'bun:test';
import { HistoryParser } from '~/parser/historyParser';
import { BrambleLexer } from '~/lexer/brambleLexer';
import type { HavenHistoryTree } from '~/model/types';

describe('HistoryParser integrated with Lexer', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('Parses history using the real lexer', () => {
    const lexer = new BrambleLexer('./test/examples/test.example.havenfs');
    lexer.run();

    const histChunk = lexer.getChunkMap().find(chunk => chunk.type === 'history');
    if (!histChunk) return;

    const history: HavenHistoryTree[] = [];
    new HistoryParser(history, histChunk.entries);

    expect(history).toHaveLength(2);
    expect(history[0].action).toBe('created');
    expect(history[1].user).toBe('ellie');
  });

  test('Parses an empty history chunk without errors', () => {
    const lexer = new BrambleLexer('./test/examples/test.empty-history.havenfs');
    lexer.run();

    const histChunk = lexer.getChunkMap().find(chunk => chunk.type === 'history');
    if (!histChunk) return;

    const history: HavenHistoryTree[] = [];
    new HistoryParser(history, histChunk.entries);

    expect(history).toHaveLength(0);

  });

  test('Handles multiple users in history correctly', () => {
    const lexer = new BrambleLexer('./test/examples/test.multi-user-history.havenfs');
    lexer.run();

    const histChunk = lexer.getChunkMap().find(chunk => chunk.type === 'history');
    if (!histChunk) return;

    const history: HavenHistoryTree[] = [];
    new HistoryParser(history, histChunk.entries);

    const users = history.map(entry => entry.user);
    expect(users).toContain('ellie');
    expect(users).toContain('joel');
    expect(users.length).toBeGreaterThan(1);
  });

  test('Throws on invalid action type in history entry', () => {
    const lexer = new BrambleLexer('./test/examples/test.invalid-action.havenfs');
    lexer.run();

    const histChunk = lexer.getChunkMap().find(chunk => chunk.type === 'history');
    if (!histChunk) return;

    const history: HavenHistoryTree[] = [];

    expect(() => {
      new HistoryParser(history, histChunk.entries);
    }).toThrow(/Invalid action/);
  });

  test('Throws an error on history entry with missing fields', () => {
    const lexer = new BrambleLexer('./test/examples/test.missing-fields.havenfs');
    lexer.run();

    const histChunk = lexer.getChunkMap().find(chunk => chunk.type === 'history');
    if (!histChunk) return;

    const history: HavenHistoryTree[] = [];

    expect(() => {
      new HistoryParser(history, histChunk.entries);
    }).toThrow(/missing/i); // Adjust the regex to match your specific error message about missing fields
  });

});
