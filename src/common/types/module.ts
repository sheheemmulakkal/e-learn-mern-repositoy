export interface IModule {
  id?: string;
  name?: string;
  courseId?: string;
  description?: string;
  module?: string;
  duration?: string;
  status?: boolean;
  createdAt?: Date;
  chapters?: IChapter[];
}

export interface IChapter {
  chapter: string;
  seconds: number;
  duration: string;
}
