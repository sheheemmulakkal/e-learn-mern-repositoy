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
        mobile
      };
      await instructorService.signup(instructorDetails);
      const otp = otpService.generateOtp();
      await otpService.createOtp({email,otp});
      otpService.sendOtpVerificationEmail(email, otp);
      res.status(201).json({ message: "OTP generated" });
    } catch (error) {
      if( error instanceof Error ) {
        next(error);
      }
    }
  }

  async resendOtp(req: Request, res: Response) {
    const { email } = req.body;
    const otp = otpService.generateOtp();
    await otpService.createOtp({email, otp});
    otpService.sendOtpVerificationEmail(email, otp);
    res.status(201).json({ message: "OTP resent"});
  }

  async VerifyInstructor(req: Request, res: Response) {
    const { otp, email } = req.body;
    const savedOtp = await otpService.findOtp(email);
    if( otp === savedOtp?.otp) {
      const instructor: IInstructor = await instructorService.verifyInstructor(email);
      const instructorJwt = jwt.sign(
        {
          instructorId: instructor.id,
          instructorName: instructor.lastname,
          instructorEmail: instructor.email
        }, 
        process.env.JWT_KEY!
      );
      res.status(200).json({ messge: "Instructor verfied", instructorToken: instructorJwt});
    } else {
      res.status(400).json({ message: "Otp Verification failed"}); 
    }
  }

  async login(req: Request, res: Response, next: NextFunction){
    try {
      const { email, password } = req.body;
      const instructor: IInstructor = await instructorService.login(email);
      if( !instructor.isBlocked ) {
        const validPassword = await bcrypt.compare(password, instructor.password);
        if(validPassword) {
          if( instructor.isVerified){
            const instructorJwt = jwt.sign(
              {
                instructorId: instructor.id,
                instructorName: instructor.lastname,
                instructorEmail: instructor.email
              }, 
              process.env.JWT_KEY!
            );
            
            res.status(200).json({message: "Instructor signed in", instructorToken: instructorJwt});
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
        throw new ForbiddenError("Instructor Blocked");
      }
    } catch (error) {
      if(error instanceof Error) {
        return next(error);
      }
    }
  }

}

