import mongoose,{ Model, Document } from "mongoose";
import { IAdmin } from "../common/types/admin";


interface AdminModel extends Model<IAdmin> {
    build(attrs: IAdmin): AdminDoc
}

interface AdminDoc extends Document {
    email: string;
    password: string;
}

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});


adminSchema.statics.build = (admin: IAdmin) => {
  return new Admin(admin);
};

const Admin = mongoose.model<AdminDoc, AdminModel>("admin", adminSchema);

export { Admin };