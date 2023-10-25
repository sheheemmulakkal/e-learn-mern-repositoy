import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
  statusCode = 401;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
