import { IOtp } from "../../common/types/otp";
export interface IOtpRepository {
  createOtp(otpDetails: IOtp): Promise<IOtp>;
  findOtp(email: string): Promise<IOtp | null>;
  updateOtp(otpDetails: IOtp): Promise<IOtp | undefined>    
}