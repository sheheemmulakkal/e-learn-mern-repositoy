import { IEnrolledCourse } from "../../common/types/enrolledCourse";

import { EnrolledCountByCategoryAndDate } from "../../common/types/dashboard";

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
  addModuleToProgression(
    enrolledId: string,
    moduleId: string
  ): Promise<IEnrolledCourse>;
  getEnrolledCoursesByStudent(studentId: string): Promise<IEnrolledCourse[]>;
  getEnrolledCoursesByCourseId(couresId: string): Promise<IEnrolledCourse[]>;
  addNotes(enrolledId: string, notes: string): Promise<IEnrolledCourse>;
  getEnrolledCountOfCategory(): Promise<EnrolledCountByCategoryAndDate[]>;
  getTotalRevnue(): Promise<number>;
  completedStatus(enrolledId: string): Promise<void>;
}
