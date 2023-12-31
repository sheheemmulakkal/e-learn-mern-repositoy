import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { ForbiddenError } from "../common/errors/forbiddenError";

declare module "express" {
  interface Request {
    currentUser?: string;
  }
}

export const isAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;
      if (decoded.role === "admin") {
        req.currentUser = decoded.adminId;
        next();
      } else {
        throw new ForbiddenError("Invalid token");
      }
    } else {
      throw new ForbiddenError("Invalid token");
    }
  } catch (error) {
    throw new ForbiddenError("Invalid token");
    res.send({});
  }
};

export const isInstructorAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
      const token = authorizationHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;
      if (decoded.role === "instructor") {
        req.currentUser = decoded.instructorId;
        next();
      } else {
        throw new ForbiddenError("Invalid token");
      }
    } else {
      throw new ForbiddenError("Invalid token");
    }
  } catch (error) {
    throw new ForbiddenError("Invalid token");
    res.send({});
  }
};

export const isStudentAuth = (
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
        throw new ForbiddenError("Invalid token");
      }
    } else {
      throw new ForbiddenError("Invalid token");
    }
  } catch (error) {
    throw new ForbiddenError("Invalid token");
    res.send({});
  }
};
