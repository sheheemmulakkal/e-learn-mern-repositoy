import { BadRequestError } from "../../common/errors/badRequestError";
import { IEnrolledCourse } from "../../common/types/enrolledCourse";
import { EnrolledCourse } from "../../models/enrolledCourse";
import { IEnrolledCourseRepository } from "../interfaces/enrolledCourseRepository.interface";
import { EnrolledCountByCategoryAndDate } from "../../common/types/dashboard";

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

  async getCourseByStudentIdAndCourseId(
    studentId: string,
    courseId: string
  ): Promise<IEnrolledCourse | null> {
    return await EnrolledCourse.findOne({ studentId, courseId }).populate({
      path: "courseId",
      populate: {
        path: "modules.module",
        model: "module",
      },
    });
  }

  async checkEnrolledCourse(
    courseId: string,
    studentId: string
  ): Promise<IEnrolledCourse | null> {
    return await EnrolledCourse.findOne({ studentId, courseId });
  }

  async addModuleToProgression(
    enrolledId: string,
    moduleId: string
  ): Promise<IEnrolledCourse> {
    const course = await EnrolledCourse.findById(enrolledId);
    if (!course) {
      throw new BadRequestError("Enrollment not found");
    }
    if (!course.progression?.includes(moduleId)) {
      course.progression?.push(moduleId);
    }
    return await course.save();
  }

  async getEnrolledCoursesByStudent(
    studentId: string
  ): Promise<IEnrolledCourse[]> {
    const enrolledCourses = await EnrolledCourse.find({ studentId }).populate({
      path: "courseId",
      populate: [
        {
          path: "modules.module",
          model: "module",
        },
        { path: "level", model: "level" },
        { path: "language", model: "language" },
        { path: "category", model: "category" },
      ],
    });
    if (!enrolledCourses) {
      throw new BadRequestError("Enrollment not found");
    }
    return enrolledCourses;
  }

  async addNotes(enrolledId: string, notes: string): Promise<IEnrolledCourse> {
    const enrolledCourse = await EnrolledCourse.findById(enrolledId);
    if (!enrolledCourse) {
      throw new BadRequestError("Enrollment not found");
    }
    enrolledCourse?.notes?.push(notes);
    return await enrolledCourse?.save();
  }
  async getEnrolledCountOfCategory(): Promise<
    EnrolledCountByCategoryAndDate[]
    // eslint-disable-next-line indent
  > {
    const result = await EnrolledCourse.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $group: {
          _id: {
            category: "$course.category",
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" },
            },
          },
          enrolledCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.category",
          data: {
            $push: {
              date: "$_id.date",
              enrolledCount: "$enrolledCount",
            },
          },
        },
      },
      {
        $project: {
          category: "$_id",
          data: 1,
          _id: 0,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
    ]);
    return result;
  }

  async getTotalRevnue(): Promise<number> {
    const result = await EnrolledCourse.aggregate([
      {
        $match: {
          status: true, // Assuming you want to consider only enrolled courses with status true
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
        },
      },
    ]);

    return result.length > 0 ? result[0].totalRevenue : 0;
  }

  async getEnrolledCoursesByCourseId(
    courseId: string
  ): Promise<IEnrolledCourse[]> {
    return await EnrolledCourse.find({ courseId }).populate("studentId");
  }

  async completedStatus(enrolledId: string): Promise<void> {
    const course = await EnrolledCourse.findById(enrolledId);
    if (course) {
      course.set({ completed: true });
    }
    await course?.save();
  }
}
