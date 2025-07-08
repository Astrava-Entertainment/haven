import { ErrorCode } from '~/common';
import { errorManager } from './errorManager';

export class HavenException extends Error {
  public readonly position: Position;
  public readonly code: ErrorCode;

  constructor(message: string, position: Position, code: ErrorCode) {
    super(message);
    this.name = 'HavenException';
    this.position = position;
    this.code = code;

    HavenException.cleanStack(this);

    errorManager.report(this);
  }

  static cleanStack(error: Error) {
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(error, this);
    }
  }
}
