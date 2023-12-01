export interface IChat {
  id?: string;
  courseId?: string;
  messages?: IMessage[];
}

export interface IMessage {
  firstname: string;
  lastname: string;
  sender?: string;
  message?: string;
  createdAt?: Date;
}
