import { HavenException } from './havenException';

class ErrorManager {
  private static instance: ErrorManager;
  private errors: Error[] = [];

  constructor() { }

  public static getInstance(): ErrorManager {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }

  public report(error: Error): void {
    this.errors.push(error);
  }

  public log() {
    for (const error of this.errors) {
      if (error instanceof HavenException) {
        console.error(
          `[${error.name}][${error.code}] Line ${error.position.line}, Col ${error.position.column}: ${error.message}`
        );
      }
      else {
        console.error(`[${error.name}]: ${error.message}`);
      }
    }
  }

  public collect(error: Error): void {
    this.report(error);
  }

  public getAll(): Error[] {
    return this.errors;
  }

  public clear(): void {
    this.errors = [];
  }
}

export const errorManager = ErrorManager.getInstance();
