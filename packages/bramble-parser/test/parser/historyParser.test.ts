import { describe, test, expect, beforeEach, vi } from 'bun:test';
import { HistoryParser } from '~/parser/historyParser';
import { BrambleLexer } from '~/lexer/brambleLexer';
import { errorManager } from '~/errors/errorManager';
import type { HavenHistoryTree } from '~/model/types';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) =>
  join(__dirname, '..', 'examples', name);
describe('HistoryParser integrated with Lexer', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
    errorManager.clear();
  });

  test('Parses history using the real lexer', () => {
    const lexer = new BrambleLexer(fixture('test.example.havenfs'));
    lexer.run();

    const histChunk = lexer.getChunkMap().find(chunk => chunk.type === 'history');
    if (!histChunk) return;

    const history: HavenHistoryTree[] = [];
    new HistoryParser(history, histChunk.entries);

    expect(history).toHaveLength(2);
    expect(history[0].action).toBe('created');
    expect(history[1].user).toBe('ellie');

    expect(errorManager.getAll().length).toBe(0);
  });

  test('Parses an empty history chunk without errors', () => {
    const lexer = new BrambleLexer(fixture( 'test.empty-history.havenfs'));
    lexer.run();

    const histChunk = lexer.getChunkMap().find(chunk => chunk.type === 'history');
    if (!histChunk) return;

    const history: HavenHistoryTree[] = [];
    new HistoryParser(history, histChunk.entries);

    expect(history).toHaveLength(0);
    expect(errorManager.getAll().length).toBe(0);
  });

  test('Handles multiple users in history correctly', () => {
    const lexer = new BrambleLexer(fixture( 'test.multi-user-history.havenfs'));
    lexer.run();

    const histChunk = lexer.getChunkMap().find(chunk => chunk.type === 'history');
    if (!histChunk) return;

    const history: HavenHistoryTree[] = [];
    new HistoryParser(history, histChunk.entries);

    const users = history.map(entry => entry.user);
    expect(users).toContain('ellie');
    expect(users).toContain('joel');
    expect(users.length).toBeGreaterThan(1);

    expect(errorManager.getAll().length).toBe(0);
  });

  test('Reports an error on invalid action type in history entry', () => {
    const lexer = new BrambleLexer(fixture( 'test.invalid-action.havenfs'));
    lexer.run();

    const histChunk = lexer.getChunkMap().find(chunk => chunk.type === 'history');
    if (!histChunk) return;

    const history: HavenHistoryTree[] = [];
    new HistoryParser(history, histChunk.entries);

    const errors = errorManager.getAll();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/Invalid action/);
  });

  test('Reports an error on history entry with missing fields', () => {
    const lexer = new BrambleLexer(fixture( 'test.missing-fields.havenfs'));
    lexer.run();

    const histChunk = lexer.getChunkMap().find(chunk => chunk.type === 'history');
    if (!histChunk) return;

    const history: HavenHistoryTree[] = [];
    new HistoryParser(history, histChunk.entries);

    const errors = errorManager.getAll();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/missing/i);
  });

});
