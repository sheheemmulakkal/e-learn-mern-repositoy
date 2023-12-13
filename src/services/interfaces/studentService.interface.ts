import { ICourse } from "../../common/types/course";
import { IEnrolledCourse } from "../../common/types/enrolledCourse";
import { ISearch } from "../../common/types/searchCourse";
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
  getSingleCourse(courseId: string): Promise<ICourse>;
  searchCourse(details: ISearch): Promise<ICourse[] | null>;
  resetForgotPassword(email: string, password: string): Promise<IStudent>;
  stripePayment(courseId: string, studentId: string): Promise<string>;
  enrollCourse(courseId: string, studentId: string): Promise<IEnrolledCourse>;
  getEnrolledCourse(
    courseId: string,
    studentId: string
  ): Promise<IEnrolledCourse | null>;
  getAllEnrolledCourses(studentId: string): Promise<IEnrolledCourse[]>;
  addProgression(
    enrollmentId: string,
    moduleId: string
  ): Promise<IEnrolledCourse>;
  addNotes(enrolledId: string, notes: string): Promise<IEnrolledCourse>;
}
