import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AdminService } from "../services/implements/adminService";
import { IAdmin } from "../common/types/admin";
import { BadRequestError } from "../common/errors/badRequestError";

const adminService = new AdminService();

export class AdminController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const admin: IAdmin = await adminService.login(email);
      if (admin.password === password) {
        const adminJwt = jwt.sign(
          {
            adminId: admin.id,
            role: "admin",
          },
          process.env.JWT_KEY!
        );
        const adminDetails = {
          _id: admin.id,
          email: admin.email,
          role: "admin"
        };

        res.status(200).json({
          admin: adminDetails,
          message: "Admin signed in",
          token: adminJwt,
          success: true,
        });
      } else {
        throw new BadRequestError("Incorrect password");
      }
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await adminService.getAllStudents();
      res.status(200).json({ students });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getAllInstructors(req: Request, res: Response, next: NextFunction) {
    try {
      const instructors = await adminService.getAllInstructors();
      res.status(200).json({ instructors });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async blockInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const { instructorId } = req.body;
      if (!instructorId) {
        throw new BadRequestError("Invalid Id");
      }
      await adminService.blockInstructor(instructorId);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async unblockInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const { instructorId } = req.body;
      if (!instructorId) {
        throw new BadRequestError("Invalid Id");
      }
      await adminService.unblockInstructor(instructorId);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async blockStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.body;
      if (!studentId) {
        throw new BadRequestError("Invalid Id");
      }
      await adminService.blockStudent(studentId);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async unblockStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.body;
      if (!studentId) {
        throw new BadRequestError("Invalid Id");
      }
      await adminService.unblockStudent(studentId);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
}
