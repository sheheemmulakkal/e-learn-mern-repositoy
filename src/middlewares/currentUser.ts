import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { ForbiddenError } from "../common/errors/forbiddenError";

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
      if (decoded.adminId) {
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
      if (decoded.instructorId) {
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
      if (decoded.studentId) {
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
