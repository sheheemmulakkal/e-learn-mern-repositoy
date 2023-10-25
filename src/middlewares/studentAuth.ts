import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../common/errors/notAuthorizedError";
import { BadRequestError } from "../common/errors/badRequestError";
import { Request, Response, NextFunction } from "express";

interface StudentPayload {
    studentId : string
    studentName: string
    studentEmail : string
}
declare module "express" {
    interface Request {
      currentStudent?: StudentPayload;
    }
  }
export const isStudentAuth = (req: Request, res: Response, next: NextFunction) => {
  if( !req.session?.jwt) {
    throw new NotAuthorizedError();
  } else {
    if( !process.env.JWT_KEY) {
      throw new BadRequestError("Jwt key not found");
    }
    try {
      const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as StudentPayload;
      req.currentStudent = payload;
    } catch (error) {
      if( error instanceof Error) {
        throw new Error(error.message);
      }
    }
    next();
  }
};
