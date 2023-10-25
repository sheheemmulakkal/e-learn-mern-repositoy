import { CustomError } from "./customError";

export class ForbiddenError extends CustomError {
  statusCode = 403;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}
