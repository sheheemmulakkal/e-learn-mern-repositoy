import { Category } from "../../models/categoryModel";
import { ICategory } from "../../common/types/category";
import { ICategoryRepository } from "../interfaces/categoryRepository.interface";

export class CategoryRepository implements ICategoryRepository {
  async createCategory(data: string): Promise<ICategory> {
    const category = Category.build({ category: data });
    return await category.save();
  }
  async findCategoryById(categoryId: string): Promise<ICategory | null> {
    return await Category.findById(categoryId);
  }
  async findCategoryByName(category: string): Promise<ICategory | null> {
    return await Category.findOne({ category });
  }
  async updateCategory(categoryId: string, data: string): Promise<ICategory> {
    const category = await Category.findById(categoryId);
    category!.set({
      category: data,
    });
    return await category!.save();
  }
  async listCategory(categoryId: string): Promise<ICategory> {
    const category = await Category.findById(categoryId);
    category!.set({
      status: true,
    });
    return await category!.save();
  }
  async unlistCategory(categoryId: string): Promise<ICategory> {
    const category = await Category.findById(categoryId);
    category!.set({
      status: false,
    });
    return await category!.save();
  }
  async getAllCategories(): Promise<ICategory[] | null> {
    return Category.find();
  }
  async getListedCategories(): Promise<ICategory[] | null> {
    return Category.find({ status: true });
  }
}
