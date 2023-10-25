import { Student } from "../models/studentModel";
import { IStudent } from "../common/types/student";

export class StudenRepository {
  async createStudent(studentDetails: IStudent): Promise<IStudent> {
    const student = Student.build(studentDetails);
    return await student.save();
  }

  async findStudentByEmail(email: string): Promise<IStudent | null> {
    return await Student.findOne({ email });
  }

  async updateUserVerification(email: string) {
    const student = await Student.findOne({email});
    student!.set({ isVerified: true });
    return await student!.save();
    
  }
}
