import { IAdmin } from "../../common/types/admin";
import { IStudent } from "../../common/types/student";
import { IInstructor } from "../../common/types/instructor";
import { ICategory } from "../../common/types/category";
import { ILevel } from "../../common/types/level";
import { ILanguage } from "../../common/types/language";

export interface IAdminService {
  login(email: string): Promise<IAdmin>;
  getAllStudents(): Promise<IStudent[] | null>;
  getAllInstructors(): Promise<IInstructor[] | null>;
  blockStudent(studentId: string): Promise<IStudent>;
  unblockStudent(studentId: string): Promise<IStudent>;
  blockInstructor(instructorId: string): Promise<IInstructor>;
  unblockInstructor(instructorId: string): Promise<IInstructor>;
  getAllCategories(): Promise<ICategory[] | null>;
  addCategory(category: string): Promise<ICategory | null>;
  editCategory(categoryId: string, data: string): Promise<ICategory>;
  listCategory(categoryId: string): Promise<ICategory>;
  unlistCategory(categoryId: string): Promise<ICategory>;
  getAllLevels(): Promise<ILevel[] | null>;
  addLevel(level: string): Promise<ILevel | null>;
  editLevel(levelId: string, data: string): Promise<ILevel>;
  listLevel(levelId: string): Promise<ILevel>;
  unlistLevel(levelId: string): Promise<ILevel>;
  getAllLanguages(): Promise<ILanguage[] | null>;
  addLanguage(language: string): Promise<ILanguage | null>;
  editLanguage(languageId: string, data: string): Promise<ILanguage>;
  listLanguage(languageId: string): Promise<ILanguage>;
  unlistLanguage(languageId: string): Promise<ILanguage>;
}
