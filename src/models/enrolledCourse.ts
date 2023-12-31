import mongoose, { Model, Document } from "mongoose";
import { IEnrolledCourse } from "../common/types/enrolledCourse";

interface EnrolledCourseModel extends Model<IEnrolledCourse> {
  build(attrs: IEnrolledCourse): EnrolledCourseDoc;
}

interface EnrolledCourseDoc extends Document {
  id?: string;
  courseId?: string;
  price?: number;
  date?: Date;
  status?: boolean;
  studentId?: string;
  progression?: string[];
  notes?: string[];
}

const enrolledCourseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      default: true,
    },
    progression: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    notes: [
      {
        type: String,
      },
    ],
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
  return new EnrolledCourse(enrolledCourse);
};

const EnrolledCourse = mongoose.model<EnrolledCourseDoc, EnrolledCourseModel>(
  "enrolledCourse",
  enrolledCourseSchema
);

export { EnrolledCourse };
