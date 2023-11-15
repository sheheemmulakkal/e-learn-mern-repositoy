import { ICourse } from "../../common/types/course";
import { IStudent } from "../../common/types/student";
export interface IStudentService {
  signup(studentDetails: IStudent): Promise<IStudent>;
  login(email: string): Promise<IStudent>;
  verifyStudent(email: string): Promise<IStudent>;
  getCourses(): Promise<ICourse[] | null>;
  updatePassword(studentId: string, password: string): Promise<IStudent>;
  findStudentById(studentId: string): Promise<IStudent>;
  updateStudentName(studentDetails: IStudent): Promise<IStudent>;
  updateProfileImage(
    studentId: string,
    file: Express.Multer.File
  ): Promise<IStudent>;
}
