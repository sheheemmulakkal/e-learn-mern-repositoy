import mongoose, { Model, Document } from "mongoose";
import { ILanguage } from "../common/types/language";

interface LanguageModel extends Model<ILanguage> {
  build(attrs: ILanguage): LanguageDoc;
}

interface LanguageDoc extends Document {
  id?: string;
  language: string;
}

const languageSchema = new mongoose.Schema(
  {
    language: {
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

languageSchema.statics.build = (language: ILanguage) => {
  return new Language(language);
};

const Language = mongoose.model<LanguageDoc, LanguageModel>(
  "language",
  languageSchema
);

export { Language };
