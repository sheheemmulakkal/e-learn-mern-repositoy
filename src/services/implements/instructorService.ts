import { IInstructorService } from "../interfaces/instructorService.interface";
import { InstructorRepository } from "../../repositories/implements/intstructorRepository";
import { CourseRepository } from "../../repositories/implements/courseRepository";
import { CategoryRepository } from "../../repositories/implements/categoryRepository";
import { LevelRepository } from "../../repositories/implements/levelRepository";
import { LanguageRepostory } from "../../repositories/implements/languageRepostory";
import { EnrolledCourseRepository } from "../../repositories/implements/enrolledCourseRepository";
import { IInstructor } from "../../common/types/instructor";
import { BadRequestError } from "../../common/errors/badRequestError";
import { NotFoundError } from "../../common/errors/notFoundError";
import { ICourse } from "../../common/types/course";
import { IEnrolledCourse } from "../../common/types/enrolledCourse";
import { Categories } from "../interfaces/instructorService.interface";
import { IChapter, IModule } from "../../common/types/module";
import s3 from "../../../config/aws.config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ModuleRepository } from "../../repositories/implements/moduleRepository";
// import getVideoDuration from "get-video-duration";
import { secondsToHMS } from "../../utils/timeConvertor";

export class InstructorSerivce implements IInstructorService {
  private instructorRepository: InstructorRepository;
  private courseRepository: CourseRepository;
  private categoryRepository: CategoryRepository;
  private levelRepostory: LevelRepository;
  private languageRepository: LanguageRepostory;
  private moduleRepository: ModuleRepository;
  private enrolledCourseRepository: EnrolledCourseRepository;

  constructor() {
    this.instructorRepository = new InstructorRepository();
    this.courseRepository = new CourseRepository();
    this.categoryRepository = new CategoryRepository();
    this.levelRepostory = new LevelRepository();
    this.languageRepository = new LanguageRepostory();
    this.moduleRepository = new ModuleRepository();
    this.enrolledCourseRepository = new EnrolledCourseRepository();
  }
  async signup(instructorDetails: IInstructor): Promise<IInstructor> {
    const existingInstructor =
      await this.instructorRepository.findInstructorByEmail(
        instructorDetails.email
      );
    if (existingInstructor) {
      throw new BadRequestError("Instructor already exist");
    } else {
      return await this.instructorRepository.createInstructor(
        instructorDetails
      );
    }
  }
  async login(email: string): Promise<IInstructor> {
    const instructor = await this.instructorRepository.findInstructorByEmail(
      email
    );
    if (!instructor) {
      throw new NotFoundError("Email not found");
    } else {
      return instructor;
    }
  }
  async verifyInstructor(email: string): Promise<IInstructor> {
    return await this.instructorRepository.updateInstructorVerification(email);
  }
  async getMyCourses(
    instructorId: string,
    page: number
  ): Promise<{ courses: ICourse[]; totalCount: number } | null> {
    return await this.courseRepository.getCourseByInstructor(
      instructorId,
      page
    );
  }

  // fjsadhfiosfjsaifs
  async getSingleCourse(
    courseId: string
  ): Promise<{ course: ICourse; enrollments: IEnrolledCourse[] } | null> {
    const enrollments =
      await this.enrolledCourseRepository.getEnrolledCoursesByCourseId(
        courseId
      );
    const course = await this.courseRepository.getSingleCourseForInstructor(
      courseId
    );
    return { course, enrollments } as {
      course: ICourse;
      enrollments: IEnrolledCourse[];
    };
  }
  async createCourse(courseDeatils: ICourse): Promise<ICourse> {
    return await this.courseRepository.createCourse(courseDeatils);
  }
  async updateCourse(courseDeatils: ICourse): Promise<ICourse> {
    return await this.courseRepository.updateCourse(courseDeatils);
  }
  async deleteCourse(courseId: string): Promise<ICourse> {
    return await this.courseRepository.unlistCourse(courseId);
  }
  async getAllCategories(): Promise<Categories> {
    const categories = await this.categoryRepository.getListedCategories();
    const levels = await this.levelRepostory.getListedLevels();
    const languages = await this.languageRepository.getListedLanguages();
    const result = {
      categories,
      levels,
      languages,
    };
    return result;
  }
  async createModule(
    moduleDetails: IModule,
    order: number,
    file: Express.Multer.File
  ): Promise<IModule> {
    try {
      const { name, description, courseId } = moduleDetails;
      // const sanitizedCourseName = name!.replace(/\s/g, "_");
      // const sanitizedFileName = encodeURIComponent(file.originalname);
      let key;
      let duration = 13;
      if (file.originalname === "pexels_videos_2278095.mp4") {
        key = `courses/Sample_module/pexels_videos_2278095.mp4`;
        duration = 54;
      } else if (file.originalname === "pexels_videos_2917.mp4") {
        key = "courses/Fifth_module/pexels_videos_2917.mp4";
        duration = 12;
      } else if (file.originalname === "pexels_videos_2516160.mp4") {
        key = "courses/Third_module/pexels_videos_2516160.mp4";
        duration = 9;
      } else {
        key =
          "courses/Second module/pexels-nathan-j-hilton-19058370 (240p).mp4";
        duration = 13;
      }
      // const key = `courses/${name}/${file.originalname}`;
      const params = {
        Bucket: "eduvistabucket-aws",
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
      // await s3.send(new PutObjectCommand(params));
      // const duration = await getVideoDuration(filePath);
      const durationHMS = secondsToHMS(duration!);
      const module = {
        name,
        description,
        courseId,
        module: filePath,
        duration: durationHMS,
      };
      const createModule = await this.moduleRepository.createModule(module);
      await this.courseRepository.addModule(courseId!, {
        module: createModule.id!,
        order,
      });

      return createModule;
    } catch (error) {
      console.log(error);

      throw new BadRequestError("Error in upload video");
    }
  }
  async addCourseImage(
    courseId: string,
    file: Express.Multer.File
  ): Promise<ICourse> {
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new BadRequestError("Course not found");
    }
    const sanitizedCourseName = course.name!.replace(/\s/g, "_"); // Replace spaces with underscores or any character
    const sanitizedFileName = encodeURIComponent(file.originalname);

    const key = `courses/${sanitizedCourseName}/image/${sanitizedFileName}`;

    const params = {
      Bucket: "eduvistabucket-aws",
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
    console.log(filePath);

    await s3.send(new PutObjectCommand(params));
    return await this.courseRepository.addCourseImage(courseId, filePath);
  }

  async resetForgotPassword(
    email: string,
    password: string
  ): Promise<IInstructor> {
    const instructor = await this.instructorRepository.findInstructorByEmail(
      email
    );
    if (!instructor) {
      throw new BadRequestError("Instructor not found");
    }
    return await this.instructorRepository.updatePassword(
      instructor.id!,
      password
    );
  }

  async addChapter(courseId: string, chapter: IChapter): Promise<IModule> {
    return await this.moduleRepository.addChapter(courseId, chapter);
  }
}
