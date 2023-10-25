import { StudenRepository } from "../repositories/studentRepository";
import { IStudent } from "../common/types/student";
import { BadRequestError } from "../common/errors/badRequestError";

export class StudentService {
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

  async verifyStudent(email: string) {
    return await this.studentRepository.updateUserVerification(email);
  }
}
