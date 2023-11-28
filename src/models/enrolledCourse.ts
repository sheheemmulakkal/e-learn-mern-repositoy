import mongoose, { Model, Document } from "mongoose";
import { IEnrolledCourse } from "../common/types/enrolledCourse";

interface CourseModel extends Model<IEnrolledCourse> {
  build(attrs: IEnrolledCourse): CourseDoc;
}

interface CourseDoc extends Document {
  id?: string;
  courseId?: string;
  price?: number;
  date?: string;
  status?: boolean;
  userId?: string;
}

const enrolledCourseSchema = new mongoose.Schema(
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

enrolledCourseSchema.statics.build = (enrolledCourse: IEnrolledCourse) => {
  return new Course(enrolledCourse);
};

const Course = mongoose.model<CourseDoc, CourseModel>(
  "enrolledCourse",
  enrolledCourseSchema
);

export { Course };
