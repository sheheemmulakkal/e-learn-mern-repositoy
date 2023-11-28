import { BadRequestError } from "../../common/errors/badRequestError";
import { IEnrolledCourse } from "../../common/types/enrolledCourse";
import { EnrolledCourse } from "../../models/enrolledCourse";
import { IEnrolledCourseRepository } from "../interfaces/enrolledCourseRepository.interface";

export class EnrolledCourseRepository implements IEnrolledCourseRepository {
  async createCourse(courseDeatils: IEnrolledCourse): Promise<IEnrolledCourse> {
    const enrollCourse = EnrolledCourse.build(courseDeatils);
    return await enrollCourse.save();
  }
  async getCourseById(courseId: string): Promise<IEnrolledCourse> {
    const enrolledCourse = await EnrolledCourse.findById(courseId);
    if (!enrolledCourse) {
      throw new BadRequestError("Course not found");
    }
    return enrolledCourse;
  }
  async checkEnrolledCourse(
    courseId: string,
    studentId: string
  ): Promise<IEnrolledCourse | null> {
    return await EnrolledCourse.findOne({ studentId, courseId });
  }
}
