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

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }

    errorManager.report(this);
  }
}
