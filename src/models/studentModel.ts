import mongoose, { Document, Model } from "mongoose";
import { IStudent } from "../common/types/student";

interface StudentModel extends Model<StudentDoc> {
  build(attrs: IStudent): StudentDoc;
}

interface StudentDoc extends Document {
  firstname: string;
  lastname: string;
  password: string;
  mobile: number;
  email: string;
  isBlocked?: boolean;
  wallet?: number;
  courses?: string[];
}

const studentSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
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

studentSchema.statics.build = (student: IStudent) => {
  return new Student(student);
};

const Student = mongoose.model<StudentDoc, StudentModel>(
  "student",
  studentSchema
);

export { Student };
