import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import { StudenRepository } from "../repositories/studentRepository";
import { StudentService } from "../services/studentService";
import { OtpRepository } from "../repositories/otpRepository";
import { OtpService } from "../services/otpService";
import { IStudent } from "../common/types/student";

const studentRepository = new StudenRepository();
const studentService = new StudentService(studentRepository);

const otpRepository = new OtpRepository();
const otpService = new OtpService(otpRepository);

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
      // const studentJwt = jwt.sign(
      //   {
      //     studentId: student.id,
      //     studentName: student.lastname,
      //     studentEmail: student.email,
      //   },
      //   process.env.JWT_KEY!
      // );

      // req.session = {
      //   studentToken: studentJwt,
      // };
      res.status(201).send({ message: "OTP generated" });
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
    res.status(201).send({ message: "OTP resent"});
  }

  async verifyStudent(req: Request, res: Response) {
    const { otp, email } = req.body;
    const savedOtp = await otpService.findOtp(email);
    if( otp === savedOtp?.otp) {
      await studentService.verifyStudent(email);
      res.status(200).send({ message: "Student Verified" });
    } else {
      res.status(400).send({ message: "Otp Verification failed"});
    }
  }

 
}
