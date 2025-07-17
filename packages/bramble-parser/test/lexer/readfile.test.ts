import { describe, test, expect, vi, afterEach } from 'bun:test';
import { BrambleLexer } from '../../src/lexer/brambleLexer';
import * as fs from 'fs';

describe('File reading', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Correctly reads the content', () => {
    const fakeContent = '# chunk "files"\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const lexer = new BrambleLexer('./test/test.example.havenfs');
    expect(lexer.documentContent).toBe(fakeContent);
  });

  test('Reads empty content', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue('');

    const lexer = new BrambleLexer('./test/empty-file.havenfs');
    expect(lexer.documentContent).toBe('');
  });

  test('Verifies that fs.readFileSync is called with the correct arguments', () => {
    const fakeContent = 'any content';
    const spy = vi.spyOn(fs, 'readFileSync').mockReturnValue(fakeContent);

    const path = './test/test-path.havenfs';
    const lexer = new BrambleLexer({document: path});

    expect(spy).toHaveBeenCalledWith(path, 'utf8');
    expect(lexer.documentContent).toBe(fakeContent);
  });

});
