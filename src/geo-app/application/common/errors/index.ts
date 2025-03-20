export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidUserLocationError extends ApplicationError {
  constructor(message?: string) {
    super(message || "Cannot enter both address and coordinates");
  }
}

export class MissingItemError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}
