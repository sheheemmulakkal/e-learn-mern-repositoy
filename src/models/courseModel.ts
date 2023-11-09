import mongoose, { Model, Document } from "mongoose";
import { ICourse } from "../common/types/course";
import { CourseApproval } from "../common/types/course";
import { IModule } from "../common/types/module";

interface CourseModel extends Model<ICourse> {
  build(attrs: ICourse): CourseDoc;
}

interface CourseDoc extends Document {
  id?: string;
  name?: string;
  description?: string;
  instructor?: string;
  image?: string;
  level?: string;
  price?: number;
  language?: string;
  category?: string;
  modules?: { module: string | IModule; order: number }[];
  createdAt?: Date;
  status?: boolean;
  approval?: CourseApproval;
}

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "level",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "language",
      required: true,
    },
    modules: [
      {
        module: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "module",
        },
        order: {
          type: Number,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    approval: {
      type: String,
      enum: ["pending", "rejected", "approved"],
      default: "pending",
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

courseSchema.statics.build = (course: ICourse) => {
  return new Course(course);
};

const Course = mongoose.model<CourseDoc, CourseModel>("course", courseSchema);

export { Course };
