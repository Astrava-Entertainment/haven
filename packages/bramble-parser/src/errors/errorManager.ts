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
    console.error(`[HavenException]: ${error.message}`);
  }

  public getAll(): Error[] {
    return this.errors;
  }

  public clear(): void {
    this.errors = [];
  }
}

export const errorManager = ErrorManager.getInstance();
