export class ServerApiValidationError extends Error {
  constructor(message: string) {
    super(message);
    // setting prototype because we are extending a built-in class
    Object.setPrototypeOf(this, ServerApiValidationError.prototype);
  }
}
