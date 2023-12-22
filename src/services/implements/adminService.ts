import { IAdminService } from "../interfaces/adminService.interface";
import { AdminRepository } from "../../repositories/implements/adminRepository";
import { InstructorRepository } from "../../repositories/implements/intstructorRepository";
import { StudentRepository } from "../../repositories/implements/studentRepository";
import { LevelRepository } from "../../repositories/implements/levelRepository";
import { LanguageRepostory } from "../../repositories/implements/languageRepostory";
import { CategoryRepository } from "../../repositories/implements/categoryRepository";
import { CourseRepository } from "../../repositories/implements/courseRepository";
import { EnrolledCourseRepository } from "../../repositories/implements/enrolledCourseRepository";
import { IAdmin } from "../../common/types/admin";
import { IStudent } from "../../common/types/student";
import { IInstructor } from "../../common/types/instructor";
import { ILanguage } from "../../common/types/language";
import { ILevel } from "../../common/types/level";
import { ICategory } from "../../common/types/category";
import { CourseApproval, ICourse } from "../../common/types/course";
import { NotFoundError } from "../../common/errors/notFoundError";
import { BadRequestError } from "../../common/errors/badRequestError";
import { emitEvent } from "../socketIoService";
import { EnrolledCountByCategoryAndDate } from "../../common/types/dashboard";

interface adminDashboardData {
  enrolledCountByCategoryAndDate: EnrolledCountByCategoryAndDate[];
  totalRevenue: number;
  studentCount: number;
  instructorCount: number;
  courseCount: number;
}

export class AdminService implements IAdminService {
  private adminRepository: AdminRepository;
  private instructorRepository: InstructorRepository;
  private studentRepository: StudentRepository;
  private categoryRepository: CategoryRepository;
  private languageRepository: LanguageRepostory;
  private levelRepository: LevelRepository;
  private courseRepository: CourseRepository;
  private enrolledCourseRepository: EnrolledCourseRepository;
  constructor() {
    this.adminRepository = new AdminRepository();
    this.instructorRepository = new InstructorRepository();
    this.studentRepository = new StudentRepository();
    this.categoryRepository = new CategoryRepository();
    this.languageRepository = new LanguageRepostory();
    this.levelRepository = new LevelRepository();
    this.courseRepository = new CourseRepository();
    this.enrolledCourseRepository = new EnrolledCourseRepository();
  }

  async login(email: string): Promise<IAdmin> {
    const admin = await this.adminRepository.findAdminByEmail(email);
    if (!admin) {
      throw new NotFoundError("Email not found");
    } else {
      return admin;
    }
  }
  async getAllStudents(): Promise<IStudent[] | null> {
    return await this.studentRepository.getAllStudents();
  }
  async getAllInstructors(): Promise<IInstructor[] | null> {
    return await this.instructorRepository.getAllInstructors();
  }
  async blockStudent(studentId: string): Promise<IStudent> {
    return await this.studentRepository.blockStudent(studentId);
  }
  async unblockStudent(studentId: string): Promise<IStudent> {
    return await this.studentRepository.unblockStudent(studentId);
  }
  async blockInstructor(instructorId: string): Promise<IInstructor> {
    return await this.instructorRepository.blockInstructor(instructorId);
  }
  async unblockInstructor(instructorId: string): Promise<IInstructor> {
    return await this.instructorRepository.unblockInstructor(instructorId);
  }

  async getAllCategories(): Promise<ICategory[] | null> {
    return await this.categoryRepository.getAllCategories();
  }
  async addCategory(category: string): Promise<ICategory | null> {
    const existingCategory = await this.categoryRepository.findCategoryByName(
      category
    );
    if (existingCategory) {
      throw new BadRequestError("Category already exist");
    } else {
      return await this.categoryRepository.createCategory(category);
    }
  }
  async editCategory(categoryId: string, data: string): Promise<ICategory> {
    const isExist = await this.categoryRepository.findCategoryByName(data);
    if (isExist) {
      throw new BadRequestError("Category already exist");
    }
    const existingCategory = await this.categoryRepository.findCategoryById(
      categoryId
    );
    if (existingCategory!.id !== categoryId) {
      throw new BadRequestError("Category already exist");
    } else {
      return await this.categoryRepository.updateCategory(categoryId, data);
    }
  }
  async listCategory(categoryId: string): Promise<ICategory> {
    return this.categoryRepository.listCategory(categoryId);
  }
  async unlistCategory(categoryId: string): Promise<ICategory> {
    return this.categoryRepository.unlistCategory(categoryId);
  }

  async getAllLevels(): Promise<ILevel[] | null> {
    return await this.levelRepository.getAllLevels();
  }
  async addLevel(level: string): Promise<ILevel | null> {
    const existingLevel = await this.levelRepository.findLevelByName(level);
    if (existingLevel) {
      throw new BadRequestError("Level already exist");
    } else {
      return await this.levelRepository.createLevel(level);
    }
  }
  async editLevel(levelId: string, data: string): Promise<ILevel> {
    const existingLevel = await this.levelRepository.findLevelById(levelId);
    if (existingLevel!.id !== levelId) {
      throw new BadRequestError("Level already exist");
    } else {
      return await this.levelRepository.updateLevel(levelId, data);
    }
  }
  async listLevel(levelId: string): Promise<ILevel> {
    return this.levelRepository.listLevel(levelId);
  }
  async unlistLevel(levelId: string): Promise<ILevel> {
    return this.levelRepository.unlistLevel(levelId);
  }

  async getAllLanguages(): Promise<ILanguage[] | null> {
    return await this.languageRepository.getAllLanguages();
  }
  async addLanguage(language: string): Promise<ILanguage | null> {
    const existingLanguage = await this.languageRepository.findLanguageByName(
      language
    );
    if (existingLanguage) {
      throw new BadRequestError("Language already exist");
    } else {
      return await this.languageRepository.createLanguage(language);
    }
  }
  async editLanguage(languageId: string, data: string): Promise<ILanguage> {
    const existingLanguage = await this.languageRepository.findLanguageById(
      languageId
    );
    if (existingLanguage!.id !== languageId) {
      throw new BadRequestError("Language already exist");
    } else {
      return await this.languageRepository.updateLanguage(languageId, data);
    }
  }
  async listLanguage(languageId: string): Promise<ILanguage> {
    return this.languageRepository.listLanguage(languageId);
  }
  async unlistLanguage(languageId: string): Promise<ILanguage> {
    return this.languageRepository.unlistLanguage(languageId);
  }

  async getAllCourses(page: number): Promise<{
    courses: ICourse[];
    totalCount: number;
  } | null> {
    return await this.courseRepository.getAllCourses(page);
  }
  async getCoursesByApproval(
    approval: CourseApproval
  ): Promise<ICourse[] | null> {
    return await this.courseRepository.getCoursesByApproval(approval);
  }
  async courseApproval(
    courseId: string,
    approval: CourseApproval
  ): Promise<ICourse> {
    const response = await this.courseRepository.courseApproval(
      courseId,
      approval
    );
    if (response.approval === "approved") {
      console.log("approved");
      emitEvent({
        event: "course-created",
        data: {
          id: response.id as string,
          courseName: response.name as string,
          image: response.image as string,
          message: "New course added",
        },
      });
    }
    return response;
  }
  async listCourse(courseId: string): Promise<ICourse> {
    return await this.courseRepository.listCourse(courseId);
  }
  async unlistCourse(courseId: string): Promise<ICourse> {
    return await this.courseRepository.unlistCourse(courseId);
  }
  async getSingleCourse(courseId: string): Promise<ICourse> {
    const course = await this.courseRepository.getSingleCourseForAdmin(
      courseId
    );
    if (!course) {
      throw new BadRequestError("Course not found");
    }
    return course;
  }
  async adminDashboardData(): Promise<adminDashboardData> {
    const enrolledCountByCategoryAndDate =
      await this.enrolledCourseRepository.getEnrolledCountOfCategory();
    const totalRevenue = await this.enrolledCourseRepository.getTotalRevnue();
    const instructorCount =
      await this.instructorRepository.getInstructorCount();
    const studentCount = await this.studentRepository.getStudentCount();
    const courseCount = await this.courseRepository.getCourseCount();

    return {
      enrolledCountByCategoryAndDate,
      totalRevenue,
      instructorCount,
      studentCount,
      courseCount,
    };
  }
}
