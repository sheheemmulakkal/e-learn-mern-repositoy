import { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import { CustomError } from "../common/errors/customError";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  res.status(400).send({
    message: "Something went wrong",
  });
  next();
};
