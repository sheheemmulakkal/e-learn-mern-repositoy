import { CourseApproval, ICourse } from "../../common/types/course";
import { ISearch } from "../../common/types/searchCourse";

export interface ICourseRepository {
  createCourse(courseDeatils: ICourse): Promise<ICourse>;
  getAllCourses(
    page: number
  ): Promise<{ courses: ICourse[]; totalCount: number } | null>;
  getCourseByInstructor(
    instructorId: string,
    page: number
  ): Promise<{ courses: ICourse[]; totalCount: number } | null>;
  getSingleCourseForInstructor(courseId: string): Promise<ICourse | null>;
  getCoursesByApproval(approval: CourseApproval): Promise<ICourse[] | null>;
  updateCourse(courseDeatils: ICourse): Promise<ICourse>;
  addModule(
    courseId: string,
    module: { module: string; order: number }
  ): Promise<ICourse>;
  findCourseById(courseId: string): Promise<ICourse | null>;
  courseApproval(courseId: string, status: string): Promise<ICourse>;
  listCourse(courseId: string): Promise<ICourse>;
  unlistCourse(courseId: string): Promise<ICourse>;
  getListedCourses({
    page,
    category,
  }: {
    page: number;
    category?: string;
  }): Promise<{
    courses: ICourse[];
    totalCount: number;
  } | null>;
  addCourseImage(courseId: string, image: string): Promise<ICourse>;
  getSingleCourseForAdmin(courseId: string): Promise<ICourse | null>;
  searchCoursesForStudents(details: ISearch): Promise<ICourse[] | null>;
  getCourseCount(): Promise<number>;
}
