export interface IStudent {
  id?: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  mobile: number;
  wallet?: number;
  isBlocked?: boolean;
  isVerified?: boolean;
  courses?: string[];
}
