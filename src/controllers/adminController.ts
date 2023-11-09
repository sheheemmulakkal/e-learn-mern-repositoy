import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AdminService } from "../services/implements/adminService";
import { IAdmin } from "../common/types/admin";
import { BadRequestError } from "../common/errors/badRequestError";
import { CourseApproval } from "../common/types/course";

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
          role: "admin",
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

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await adminService.getAllCategories();
      res.status(200).json({ categories });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.body;
      console.log(category);

      const upperCaseCategory = category.toUpperCase();
      const newCategory = await adminService.addCategory(upperCaseCategory);
      res.status(201).json({ category: newCategory });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        next(error);
      }
    }
  }

  async editCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, data } = req.body;
      const upperCaseData = data.toUpperCase();
      const updatedCaetgory = await adminService.editCategory(
        categoryId,
        upperCaseData
      );
      res.status(200).json({ category: updatedCaetgory });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        next(error);
      }
    }
  }

  async listCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.body;
      const listedCategory = await adminService.listCategory(categoryId);
      res.status(200).json({ category: listedCategory, success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async unlistCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.body;
      const unlistedCategory = await adminService.unlistCategory(categoryId);
      res.status(200).json({ category: unlistedCategory, success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getAllLevels(req: Request, res: Response, next: NextFunction) {
    try {
      const levels = await adminService.getAllLevels();
      res.status(200).json({ levels });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async addLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const { level } = req.body;
      const upperCaseLevel = level.toUpperCase();
      const newLevel = await adminService.addLevel(upperCaseLevel);
      res.status(201).json({ level: newLevel });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async editLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const { levelId, data } = req.body;
      const upperCaseData = data.toUpperCase();
      const updatedLevel = await adminService.editLevel(levelId, upperCaseData);
      res.status(200).json({ level: updatedLevel });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async listLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const { levelId } = req.body;
      const listedLevel = await adminService.listLevel(levelId);
      res.status(200).json({ level: listedLevel, success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async unlistLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const { levelId } = req.body;
      const unlistedLevel = await adminService.unlistLevel(levelId);
      res.status(200).json({ level: unlistedLevel, success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getAllLanguages(req: Request, res: Response, next: NextFunction) {
    try {
      const languages = await adminService.getAllLanguages();
      res.status(200).json({ languages });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async addLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const { language } = req.body;
      const upperCaseLanguage = language.toUpperCase();
      const newLanguage = await adminService.addLanguage(upperCaseLanguage);
      res.status(201).json({ language: newLanguage });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async editLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const { languageId, data } = req.body;
      const upperCaseData = data.toUpperCase();
      const updatedLanguage = await adminService.editLanguage(
        languageId,
        upperCaseData
      );
      res.status(200).json({ language: updatedLanguage });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async listLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const { languageId } = req.body;
      const listedLanguage = await adminService.listLanguage(languageId);
      res.status(200).json({ language: listedLanguage, success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async unlistLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const { languageId } = req.body;
      const unlistedLanguage = await adminService.unlistLanguage(languageId);
      res.status(200).json({ language: unlistedLanguage, success: true });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await adminService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getPendingCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const pendingCourses = await adminService.getCoursesByApproval(
        CourseApproval.pending
      );
      res.status(200).json(pendingCourses);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getRejectedCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const rejectedCourses = await adminService.getCoursesByApproval(
        CourseApproval.rejected
      );
      res.status(200).json(rejectedCourses);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getApprovedCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const approvedCourses = await adminService.getCoursesByApproval(
        CourseApproval.approved
      );
      res.status(200).json(approvedCourses);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async listCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      if (!courseId) {
        throw new BadRequestError("Course Id not found");
      }
      const course = await adminService.listCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async unlistCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      if (!courseId) {
        throw new BadRequestError("Course Id not found");
      }
      const course = await adminService.unlistCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async approveCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      if (!courseId) {
        throw new BadRequestError("Course Id not found");
      }
      const course = await adminService.courseApproval(
        courseId,
        CourseApproval.approved
      );
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async rejectCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      if (!courseId) {
        throw new BadRequestError("Course Id not found");
      }
      const course = await adminService.courseApproval(
        courseId,
        CourseApproval.rejected
      );
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
}
