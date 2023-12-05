import { IEnrolledCourse } from "../../common/types/enrolledCourse";

export interface IEnrolledCourseRepository {
  createCourse(courseDeatils: IEnrolledCourse): Promise<IEnrolledCourse>;
  getCourseById(courseId: string): Promise<IEnrolledCourse>;
  getCourseByStudentIdAndCourseId(
    studentId: string,
    courseId: string
  ): Promise<IEnrolledCourse | null>;
  checkEnrolledCourse(
    courseId: string,
    studentId: string
  ): Promise<IEnrolledCourse | null>;
}
