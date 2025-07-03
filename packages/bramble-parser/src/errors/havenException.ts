import { errorManager } from './errorManager';

export class HavenException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HavenException';

    // Not sure if this is the correct way to do this
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }

    errorManager.report(this);
  }
}
