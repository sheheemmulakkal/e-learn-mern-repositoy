import { IOtp } from "../../common/types/otp";
export interface IOtpService {
    createOtp(otpDetails: IOtp): Promise<IOtp | undefined>;
    findOtp(email: string): Promise<IOtp | null>;
    generateOtp(): string;
    sendOtpVerificationEmail(email: string, otp: string): Promise<void>;
    maskMail(email: string): string;
}