import { IChatRepository } from "../interfaces/chatRepository.interface";
import { IChat, IMessage } from "../../common/types/chat";
import { Chat } from "../../models/chatModel";
import { BadRequestError } from "../../common/errors/badRequestError";

export class ChatRepository implements IChatRepository {
  async createChatRoom(chatDetails: IChat): Promise<IChat> {
    const chatroom = Chat.build(chatDetails);
    return await chatroom.save();
  }

  async getChatByCourseId(courseId: string): Promise<IChat | null> {
    return await Chat.findOne({ courseId });
  }

  async addMessage(courseId: string, message: IMessage): Promise<IChat> {
    const chat = await Chat.findOne({ courseId });
    if (!chat) {
      throw new BadRequestError("Chat not found");
    }
    chat.messages?.push(message);
    return await chat.save();
  }
}
