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
      await otpService.createOtp({email, otp});
      otpService.sendOtpVerificationEmail(email, otp);
      res.status(201).json({ message: "OTP generated" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return next(error);
      } else {
        console.log("An unknow error occured");
      }
    }
  }

  async resendOtp( req: Request, res: Response) {
    const { email } = req.body;
    const otp = otpService.generateOtp();
    await otpService.createOtp({email, otp});
    otpService.sendOtpVerificationEmail(email, otp);
    res.status(201).json({ message: "OTP resent"});
  }

  async verifyStudent(req: Request, res: Response) {
    const { otp, email } = req.body;
    const savedOtp = await otpService.findOtp(email);
    if( otp === savedOtp?.otp) {
      const student: IStudent = await studentService.verifyStudent(email);
      const studentJwt = jwt.sign(
        {
          studentId: student.id,
          studentName: student.lastname,
          studentEmail: student.email,
        },
        process.env.JWT_KEY!
      );
      req.session = {
        studentToken: studentJwt,
      };
      res.status(200).json({ message: "Student Verified" });
    } else {
      res.status(400).json({ message: "Otp Verification failed"});
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const student: IStudent = await studentService.login(email);
      if( !student.isBlocked ) {
        const validPassword = await bcrypt.compare(password, student.password);
        if(validPassword) {
          if( student.isVerified){
            const studentJwt = jwt.sign(
              {
                studentId: student.id,
                studentName: student.lastname,
                studentEmail: student.email,
              },
              process.env.JWT_KEY!
            );
            req.session = {
              studentToken: studentJwt,
            };
            res.status(200).json({message: "Student signed in"});
          } else {
            const otp = otpService.generateOtp();
            await otpService.createOtp({email, otp});
            otpService.sendOtpVerificationEmail(email, otp);
            const maskedEmail = otpService.maskMail(email);
            throw new NotAuthorizedError(`Not verified, OTP sent to ${maskedEmail}`);
          }
        } else {
          throw new BadRequestError("Incorrect password");
        }
      } else {
        throw new ForbiddenError("Student Blocked");
      }
      
    } catch (error) {
      if(error instanceof Error) {
        return next(error);
      }
    }
  }

  signout(req: Request, res: Response) {
    req.session = null;
    res.status(200).json({message: "Student signed out"});
  }

}
