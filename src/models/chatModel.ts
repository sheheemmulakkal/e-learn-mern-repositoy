import mongoose, { Model, Document } from "mongoose";
import { IChat, IMessage } from "../common/types/chat";

interface ChatModel extends Model<IChat> {
  build(attrs: IChat): ChatDoc;
}

interface ChatDoc extends Document {
  id?: string;
  courseId?: string;
  messages?: IMessage[];
}

const chatSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "course",
    },

    messages: [
      {
        firstname: {
          type: String,
          required: true,
        },
        lastname: {
          type: String,
          required: true,
        },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
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

chatSchema.statics.build = (chat: IChat) => {
  return new Chat(chat);
};

const Chat = mongoose.model<ChatDoc, ChatModel>("chat", chatSchema);

export { Chat };
