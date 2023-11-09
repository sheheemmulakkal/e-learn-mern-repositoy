import { IInstructorService } from "../interfaces/instructorService.interface";
import { InstructorRepository } from "../../repositories/implements/intstructorRepository";
import { CourseRepository } from "../../repositories/implements/courseRepository";
import { CategoryRepository } from "../../repositories/implements/categoryRepository";
import { LevelRepository } from "../../repositories/implements/levelRepository";
import { LanguageRepostory } from "../../repositories/implements/languageRepostory";
import { IInstructor } from "../../common/types/instructor";
import { BadRequestError } from "../../common/errors/badRequestError";
import { NotFoundError } from "../../common/errors/notFoundError";
import { ICourse } from "../../common/types/course";
import { Categories } from "../interfaces/instructorService.interface";

export class InstructorSerivce implements IInstructorService {
  private instructorRepository: InstructorRepository;
  private courseRepository: CourseRepository;
  private categoryRepository: CategoryRepository;
  private levelRepostory: LevelRepository;
  private languageRepository: LanguageRepostory;
  constructor() {
    this.instructorRepository = new InstructorRepository();
    this.courseRepository = new CourseRepository();
    this.categoryRepository = new CategoryRepository();
    this.levelRepostory = new LevelRepository();
    this.languageRepository = new LanguageRepostory();
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
  async getMyCourses(instructorId: string): Promise<ICourse[] | null> {
    return await this.courseRepository.getCourseByInstructor(instructorId);
  }
  async getSingleCourse(courseId: string): Promise<ICourse | null> {
    return await this.courseRepository.getSingleCourseForInstructor(courseId);
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
}
