import { IModule } from "./module";
export enum CourseApproval {
  pending = "pending",
  rejected = "rejected",
  approved = "approved",
}
export interface ICourse {
  id?: string;
  name?: string;
  description?: string;
  instructor?: string;
  image?: string;
  price?: number;
  level?: string;
  language?: string;
  category?: string;
  modules?: { module: string | IModule; order: number }[];
  createdAt?: Date;
  status?: boolean;
  approval?: CourseApproval;
}
