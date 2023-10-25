
import { OtpRepository } from "../repositories/otpRepository";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { IOtp } from "../common/types/otp";



export class OtpService {
  private otpRepository: OtpRepository;
  constructor(otpRepository: OtpRepository) {
    this.otpRepository = otpRepository;
  }

  async createOtp(otpDetails: IOtp) {

    const otp = await this.otpRepository.findOtp(otpDetails.email);
    if( !otp ) {
      return this.otpRepository.createOtp(otpDetails);
    } else {
      return this.otpRepository.updateOtp(otpDetails);
    }
  }

  async findOtp(email: string) {
    return this.otpRepository.findOtp(email);
  }

  generateOtp(): string {
    const generatedOtp = otpGenerator.generate(6, {
      upperCaseAlphabets : false,
      lowerCaseAlphabets : false,
      specialChars : false
    });
    console.log(generatedOtp);
    
    return generatedOtp;
  }

  async sendOtpVerificationEmail(email: string, otp: string) {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      service: "Gmail",
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD
      },
    });
    
    transporter.sendMail({
      to: email,
      from: process.env.USER_EMAIL,
      subject: "EduVista OTP Verification",
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing EduVista. Use the following OTP to complete your Sign Up procedures.
           OTP is valid for 10 minutes</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color:
           #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />EduVista</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Your EduVista Inc</p>
            <p>KINFRA SDF Building</p>
            <p>Kerala</p>
            <p>India</p>
          </div>
        </div>
      </div>`
    });
  }
}