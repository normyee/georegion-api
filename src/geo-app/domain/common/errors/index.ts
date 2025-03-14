export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class RegionNameError extends DomainError {
  constructor(message?: string) {
    super(message || "Region name cannot be empty");
  }
}
