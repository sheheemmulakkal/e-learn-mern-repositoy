import mongoose, { Model, Document } from "mongoose";
import { ICategory } from "../common/types/category";

interface CategoryModel extends Model<ICategory> {
  build(attrs: ICategory): CategoryDoc;
}

interface CategoryDoc extends Document {
  id?: string;
  category: string;
}

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

categorySchema.statics.build = (category: ICategory) => {
  return new Category(category);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>(
  "category",
  categorySchema
);

export { Category };
