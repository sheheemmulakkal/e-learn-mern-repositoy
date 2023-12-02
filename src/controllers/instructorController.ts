import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OtpService } from "../services/implements/otpService";
import { BadRequestError } from "../common/errors/badRequestError";
import { ForbiddenError } from "../common/errors/forbiddenError";
import { NotAuthorizedError } from "../common/errors/notAuthorizedError";
import { InstructorSerivce } from "../services/implements/instructorService";
import { IInstructor } from "../common/types/instructor";

const otpService = new OtpService();
const instructorService = new InstructorSerivce();

export class InstructorController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstname, lastname, email, password, mobile } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const instructorDetails: IInstructor = {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        mobile,
      };
      await instructorService.signup(instructorDetails);
      const otp = otpService.generateOtp();
      await otpService.createOtp({ email, otp });
      otpService.sendOtpVerificationEmail(email, otp);
      res.status(201).json({ message: "OTP generated", email });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async resendOtp(req: Request, res: Response) {
    const { email } = req.body;
    const otp = otpService.generateOtp();
    await otpService.createOtp({ email, otp });
    otpService.sendOtpVerificationEmail(email, otp);
    res.status(201).json({ message: "OTP resent" });
  }

  async VerifyInstructor(req: Request, res: Response) {
    const { otp, email } = req.body;
    const savedOtp = await otpService.findOtp(email);
    if (otp === savedOtp?.otp) {
      const instructor: IInstructor = await instructorService.verifyInstructor(
        email
      );
      const instructorJwt = jwt.sign(
        {
          instructorId: instructor.id,
          role: "instructor",
        },
        process.env.JWT_KEY!
      );
      const instructorDetails = {
        _id: instructor.id,
        firstname: instructor.firstname,
        lastname: instructor.lastname,
        email: instructor.email,
        mobile: instructor.mobile,
        wallet: instructor.wallet,
        courses: instructor.courses,
        role: "instructor",
      };
      res.status(200).json({
        messge: "Instructor verfied",
        token: instructorJwt,
        instructor: instructorDetails,
      });
    } else {
      res.status(400).json({ message: "Otp Verification failed" });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const instructor: IInstructor = await instructorService.login(email);
      if (!instructor.isBlocked) {
        const validPassword = await bcrypt.compare(
          password,
          instructor.password!
        );
        if (validPassword) {
          if (instructor.isVerified) {
            const instructorJwt = jwt.sign(
              {
                instructorId: instructor.id,
                role: "instructor",
              },
              process.env.JWT_KEY!
            );
            const instructorDetails = {
              _id: instructor.id,
              firstname: instructor.firstname,
              lastname: instructor.lastname,
              email: instructor.email,
              mobile: instructor.mobile,
              wallet: instructor.wallet,
              courses: instructor.courses,
              walletHistory: instructor.walletHistory,
              role: "instructor",
            };
            res.status(200).json({
              message: "Instructor signed in",
              token: instructorJwt,
              instructor: instructorDetails,
              success: true,
            });
          } else {
            const otp = otpService.generateOtp();
            await otpService.createOtp({ email, otp });
            otpService.sendOtpVerificationEmail(email, otp);
            throw new NotAuthorizedError("Not verified");
          }
        } else {
          throw new BadRequestError("Incorrect password");
        }
      } else {
        throw new ForbiddenError("Instructor Blocked");
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async getMycourses(req: Request, res: Response, next: NextFunction) {
    try {
      const instructorId = req.currentUser;
      if (!instructorId) {
        throw new ForbiddenError("Invalid token");
      }
      const courses = await instructorService.getMyCourses(instructorId);
      res.status(200).json(courses);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async addCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const instructorId = req.currentUser;
      const { name, description, level, language, category, price } = req.body;
      const courseCredentials = {
        name,
        description,
        level,
        language,
        category,
        price,
        instructor: instructorId,
      };
      const course = await instructorService.createCourse(courseCredentials);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);

        next(error);
      }
    }
  }

  async getSingleCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      if (!courseId) {
        throw new BadRequestError("Course id not found");
      }
      const course = await instructorService.getSingleCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name, description, level, language, category, price } =
        req.body;
      const courseCredentials = {
        name,
        id,
        description,
        level,
        language,
        category,
        price,
      };
      const course = await instructorService.updateCourse(courseCredentials);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      if (!courseId) {
        throw new BadRequestError("Course id not found");
      }
      const course = await instructorService.deleteCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await instructorService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async createModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, courseId } = req.body;
      const file = req.file;
      const existingModule = await instructorService.getSingleCourse(courseId);
      const order = (existingModule?.modules?.length || 0) + 1;
      await instructorService.createModule(
        { name, description, courseId },
        order,
        file!
      );
      const course = await instructorService.getSingleCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async updateCourseImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      const file = req.file;
      if (!file) {
        throw new BadRequestError("file not found");
      }
      await instructorService.addCourseImage(courseId, file);
      const course = await instructorService.getSingleCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async forgotPasswordOtpVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { otp, email } = req.body;
      console.log(otp, email);

      const savedOtp = await otpService.findOtp(email);
      if (savedOtp?.otp === otp) {
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false });
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async resetForgottedPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const instructor = await instructorService.resetForgotPassword(
        email,
        hashedPassword
      );
      res.status(200).json(instructor);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
}
