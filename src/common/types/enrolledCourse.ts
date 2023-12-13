export interface IEnrolledCourse {
  id?: string;
  courseId?: string;
  price?: number;
  date?: Date;
  status?: boolean;
  studentId?: string;
  progression?: string[];
  notes?: string[];
}
