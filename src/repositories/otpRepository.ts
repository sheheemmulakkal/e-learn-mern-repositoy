import { Otp } from "../models/otpModel";
import { IOtp } from "../common/types/otp";

export class OtpRepository{
  async createOtp(otpDetails: IOtp): Promise<IOtp> {
    const otp = Otp.build(otpDetails);
    return await otp.save();
  }
    
  async findOtp(email: string): Promise<IOtp | null> {
    return await Otp.findOne({email});
  }

  async updateOtp(otpDetails: IOtp): Promise<IOtp | undefined> {
    const otp = await Otp.findOne({email: otpDetails.email});
    otp!.set({
      otp: otpDetails.otp,
      createdAt: new Date()
    });
    return await otp!.save();
  }

}