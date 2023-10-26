import { StudenRepository } from "../../repositories/implements/studentRepository";
import { IStudent } from "../../common/types/student";
import { IStudentService } from "../interfaces/IStudentService";
import { BadRequestError } from "../../common/errors/badRequestError";
import { NotFoundError } from "../../common/errors/notFoundError";

export class StudentService implements IStudentService{
  private studentRepository: StudenRepository;

  constructor(studentRepository: StudenRepository) {
    this.studentRepository = studentRepository;
  }

  async signup(studentDetails: IStudent): Promise<IStudent> {
    const existingStudent = await this.studentRepository.findStudentByEmail(
      studentDetails.email
    );
    if (existingStudent) {
      throw new BadRequestError("Student already exist");
    } else {
      return await this.studentRepository.createStudent(studentDetails);
    }
  }

  async login(email: string): Promise<IStudent> {
    const student = await this.studentRepository.findStudentByEmail(email);
    if(!student){
      throw new NotFoundError("Email not found");
    } else {
      return student;
    }
  }

  async verifyStudent(email: string): Promise<IStudent> {
    return await this.studentRepository.updateUserVerification(email);
  }
}
