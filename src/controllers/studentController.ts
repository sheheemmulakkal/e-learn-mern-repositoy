import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StudentService } from "../services/implements/studentService";
import { OtpService } from "../services/implements/otpService";
import { IStudent } from "../common/types/student";
import { BadRequestError } from "../common/errors/badRequestError";
import { ForbiddenError } from "../common/errors/forbiddenError";
import { NotAuthorizedError } from "../common/errors/notAuthorizedError";

const studentService = new StudentService();
const otpService = new OtpService();

export class StudentController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstname, lastname, email, password, mobile } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const studentDetails: IStudent = {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        mobile,
      };
      await studentService.signup(studentDetails);
      const otp = otpService.generateOtp();
      await otpService.createOtp({ email, otp });
      otpService.sendOtpVerificationEmail(email, otp);
      res.status(201).json({ message: "OTP generated", email });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return next(error);
      } else {
        console.log("An unknow error occured");
      }
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const otp = otpService.generateOtp();
      await otpService.createOtp({ email, otp });
      otpService.sendOtpVerificationEmail(email, otp);
      res.status(201).json({ message: "OTP resent" });
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  }

  async verifyStudent(req: Request, res: Response) {
    const { otp, email } = req.body;
    const savedOtp = await otpService.findOtp(email);
    if (otp === savedOtp?.otp) {
      const student: IStudent = await studentService.verifyStudent(email);
      const studentJwt = jwt.sign(
        {
          studentId: student.id,
          role: "student",
        },
        process.env.JWT_KEY!
      );
      const studentDetails = {
        _id: student.id,
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        mobile: student.mobile,
        wallet: student.wallet,
        courses: student.courses,
        role: "student",
      };
      res.status(200).json({
        message: "Student Verified",
        token: studentJwt,
        student: studentDetails,
      });
    } else {
      res.status(400).json({ message: "Otp Verification failed" });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const student: IStudent = await studentService.login(email);
      if (!student.isBlocked) {
        const validPassword = await bcrypt.compare(password, student.password!);
        if (validPassword) {
          if (student.isVerified) {
            const studentJwt = jwt.sign(
              {
                studentId: student.id,
                role: "student",
              },
              process.env.JWT_KEY!
            );
            const studentDetails = {
              _id: student.id,
              firstname: student.firstname,
              lastname: student.lastname,
              email: student.email,
              mobile: student.mobile,
              wallet: student.wallet,
              courses: student.courses,
              role: "student",
            };
            res.status(200).json({
              message: "Student signed in",
              token: studentJwt,
              student: studentDetails,
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
        throw new ForbiddenError("Student Blocked");
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await studentService.getCourses();
      res.status(200).json(courses);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { newPassword, currentPassword } = req.body;
      const studentId = req.currentUser;
      if (!studentId) {
        console.log("hiiiiiiiiiiiiiiiii");

        throw new NotAuthorizedError("Invalid token");
      }
      const student: IStudent = await studentService.findStudentById(studentId);

      const isPasswordVerified = await bcrypt.compare(
        currentPassword,
        student.password!
      );

      if (!isPasswordVerified) {
        throw new BadRequestError("Incorrect password");
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const {
          firstname,
          lastname,
          email,
          id,
          mobile,
          courses,
          wallet,
          isBlocked,
          isVerified,
        } = await studentService.updatePassword(studentId, hashedPassword);
        const updatedData = {
          firstname,
          lastname,
          email,
          id,
          mobile,
          courses,
          wallet,
          isBlocked,
          isVerified,
        };
        res.status(200).json(updatedData);
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
}
