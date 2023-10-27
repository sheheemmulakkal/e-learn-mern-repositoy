import mongoose, { Document, Model } from "mongoose";
import { IInstructor, Transaction } from "../common/types/instructor";

interface InstructorModel extends Model<InstructorDoc> {
    build(attrs: IInstructor): InstructorDoc;
}

interface InstructorDoc extends Document {
    id?: string
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    mobile: number;
    qualification?: string;
    isBlocked?: boolean;
    isVerified?: boolean;
    wallet?: number;
    walletHistory?: Transaction[]
}

const instructorSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  qualification: {
    type: String
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  wallet: {
    type: Number,
    default: 0
  },
  walletHistory: 
    [{
      date: {
        type: Date
      },
      amount: {
        type: Number
      },
      description: {
        type: String
      }
    }],
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses"
  }]
  
},{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret.id;
    }
  }
});

instructorSchema.statics.build = (instructor: IInstructor) => {
  return new Instructor(instructor);
};

const Instructor = mongoose.model<InstructorDoc, InstructorModel>("instructor", instructorSchema);

export { Instructor };

