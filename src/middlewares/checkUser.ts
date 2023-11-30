import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express" {
  interface Request {
    currentUser?: string;
  }
}

export const checkStudent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;

      if (decoded.role === "student") {
        req.currentUser = decoded.studentId;
        next();
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    next();
  }
};
