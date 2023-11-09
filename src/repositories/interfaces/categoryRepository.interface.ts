import { ICategory } from "../../common/types/category";

export interface ICategoryRepository {
  createCategory(category: string): Promise<ICategory>;
  findCategoryByName(category: string): Promise<ICategory | null>;
  findCategoryById(categoryId: string): Promise<ICategory | null>;
  updateCategory(categoryId: string, data: string): Promise<ICategory>;
  listCategory(categoryId: string): Promise<ICategory>;
  unlistCategory(categoryId: string): Promise<ICategory>;
  getAllCategories(): Promise<ICategory[] | null>;
  getListedCategories(): Promise<ICategory[] | null>;
}
