import { Course } from "../../models/courseModel";
import { ICourse } from "../../common/types/course";
import { CourseApproval } from "../../common/types/course";
import { ICourseRepository } from "../interfaces/courseRepository.interface";
import { NotFoundError } from "../../common/errors/notFoundError";
import { ISearch } from "../../common/types/searchCourse";

export class CourseRepository implements ICourseRepository {
  async createCourse(courseDeatils: ICourse): Promise<ICourse> {
    const course = Course.build(courseDeatils);
    return await course.save();
  }

  async getAllCourses(): Promise<ICourse[] | null> {
    return await Course.find()
      .populate("category")
      .populate("level")
      .populate("language");
  }

  async getCourseByInstructor(instructorId: string): Promise<ICourse[] | null> {
    return await Course.find({ instructor: instructorId })
      .populate("category")
      .populate("level")
      .populate("language");
  }

  async getSingleCourseForInstructor(
    courseId: string
  ): Promise<ICourse | null> {
    return await Course.findById(courseId)
      .populate("instructor")
      .populate("level")
      .populate("category")
      .populate("language")
      .populate({
        path: "modules.module",
        model: "module",
      });
  }

  async getCoursesByApproval(
    approval: CourseApproval
  ): Promise<ICourse[] | null> {
    return await Course.find({ approval });
  }

  async findCourseById(courseId: string): Promise<ICourse | null> {
    console.log(courseId, "id respo");

    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    return course;
  }

  async updateCourse(courseDeatils: ICourse): Promise<ICourse> {
    const { id, name, category, description, price, image, language, level } =
      courseDeatils;
    const course = await Course.findById(id);
    course!.set({
      name,
      category,
      description,
      image,
      price,
      language,
      level,
    });
    return await course!.save();
  }

  async addModule(
    courseId: string,
    module: { module: string; order: number }
  ): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    course?.modules?.push(module);
    return await course.save();
  }

  async courseApproval(
    courseId: string,
    status: CourseApproval
  ): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    course.set({
      approval: status,
    });
    return await course.save();
  }

  async listCourse(courseId: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    course.set({
      status: true,
    });
    return await course.save();
  }

  async unlistCourse(courseId: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    course.set({
      status: false,
    });
    return await course.save();
  }

  async getListedCourses(): Promise<ICourse[] | null> {
    return await Course.find({
      status: true,
      approval: CourseApproval.approved,
    })
      .populate("category")
      .populate("level")
      .populate("language");
  }

  async addCourseImage(courseId: string, image: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    course!.set({
      image,
    });
    return await course!.save();
  }
  async getSingleCourseForAdmin(courseId: string): Promise<ICourse | null> {
    const course = await Course.findById(courseId)
      .populate("instructor")
      .populate("level")
      .populate("category")
      .populate("language")
      .populate({
        path: "modules.module",
        model: "module",
      });
    return course;
  }

  async searchCoursesForStudents(details: ISearch): Promise<ICourse[] | null> {
    const course = await Course.find({ approval: "approved", ...details });
    return course;
  }

  async getCourseCount(): Promise<number> {
    return await Course.count({ approval: CourseApproval.approved });
  }
}
