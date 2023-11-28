import { IEnrolledCourse } from "../../common/types/enrolledCourse";

export interface IEnrolledCourseRepository {
  createCourse(courseDeatils: IEnrolledCourse): Promise<IEnrolledCourse>;
  getCourseById(courseId: string): Promise<IEnrolledCourse>;
  checkEnrolledCourse(
    courseId: string,
    studentId: string
  ): Promise<IEnrolledCourse | null>;
}
