import { Student } from "../../models/studentModel";
import { IStudent } from "../../common/types/student";
import { IStudnetRepository } from "../interfaces/studentRepository.interface";

export class StudentRepository implements IStudnetRepository{
  async createStudent(studentDetails: IStudent): Promise<IStudent> {
    const student = Student.build(studentDetails);
    return await student.save();
  }

  async findStudentByEmail(email: string): Promise<IStudent | null> {
    return await Student.findOne({ email });
  }

  async updateUserVerification(email: string): Promise<IStudent> {
    const student = await Student.findOne({email});
    student!.set({ isVerified: true });
    const students = await student!.save();
    return students;
    
  }

  async getAllStudents(): Promise<IStudent[] | null> {
    return await Student.find();
  }

  async blockStudent(studentId: string): Promise<IStudent> {
    const student = await Student.findOne({_id: studentId});
    student!.set({ isBlocked: true });
    return await student!.save();
  }

  async unblockStudent(studentId: string): Promise<IStudent> {
    const student = await Student.findOne({_id: studentId});
    student!.set({ isBlocked: false });
    return await student!.save();
  }
}
