import mongoose, { Model, Document } from "mongoose";
import { ILevel } from "../common/types/level";

interface LevelModel extends Model<ILevel> {
  build(attrs: ILevel): LevelDoc;
}

interface LevelDoc extends Document {
  id?: string;
  level: string;
}

const levelSchema = new mongoose.Schema(
  {
    level: {
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

levelSchema.statics.build = (level: ILevel) => {
  return new Level(level);
};

const Level = mongoose.model<LevelDoc, LevelModel>("level", levelSchema);

export { Level };
