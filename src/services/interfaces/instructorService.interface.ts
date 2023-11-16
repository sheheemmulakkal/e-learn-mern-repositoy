import { IInstructor } from "../../common/types/instructor";
import { ICourse } from "../../common/types/course";
import { ICategory } from "../../common/types/category";
import { ILevel } from "../../common/types/level";
import { ILanguage } from "../../common/types/language";
import { IModule } from "../../common/types/module";

export interface Categories {
  categories: ICategory[] | null;
  levels: ILevel[] | null;
  languages: ILanguage[] | null;
}

export interface IInstructorService {
  signup(instructorDetails: IInstructor): Promise<IInstructor>;
  login(email: string): Promise<IInstructor>;
  verifyInstructor(email: string): Promise<IInstructor>;
  getMyCourses(instructorId: string): Promise<ICourse[] | null>;
  createCourse(courseDeatils: ICourse): Promise<ICourse>;
  updateCourse(courseDeatils: ICourse): Promise<ICourse>;
  addCourseImage(courseId: string, file: Express.Multer.File): Promise<ICourse>;
  deleteCourse(courseId: string): Promise<ICourse>;
  getAllCategories(): Promise<Categories>;
  createModule(
    moduleDetails: IModule,
    order: number,
    file: Express.Multer.File
  ): Promise<IModule>;
  // updateModule(moduleDetails: IModule): Promise<IModule>;
  // listModule(moduleDetails: IModule): Promise<IModule>;
  // unlistModule(moduleDetails: IModule): Promise<IModule>;
}
