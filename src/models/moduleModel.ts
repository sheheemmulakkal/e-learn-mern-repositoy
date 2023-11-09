import mongoose, { Model, Document } from "mongoose";
import { IModule } from "../common/types/module";

interface ModuleModel extends Model<IModule> {
  build(attrs: IModule): ModuleDoc;
}

interface ModuleDoc extends Document {
  id?: string;
  name?: string;
  module?: string;
  description?: string;
  duration?: string;
  status?: boolean;
  createdAt?: Date;
}

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
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

moduleSchema.statics.build = (module: IModule) => {
  return new Module(module);
};

const Module = mongoose.model<ModuleDoc, ModuleModel>("module", moduleSchema);

export { Module };
