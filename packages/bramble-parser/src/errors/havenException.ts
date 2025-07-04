import { ErrorCode } from '~/common';
import { errorManager } from './errorManager';

export class HavenException extends Error {
  public readonly line: number;
  public readonly column: number;
  public readonly code: ErrorCode;

  constructor(message: string, line: number, column: number, code: ErrorCode) {
    super(message);
    this.name = 'HavenException';
    this.line = line;
    this.column = column;
    this.code = code;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }

    errorManager.report(this);
  }
}
