export interface EnrolledCountByCategoryAndDate {
  data: {
    date: string;
    enrolledCount: number;
  }[];
  category: string;
  categoryDetails: {
    _id: string;
    category: string;
    status: boolean;
    __v: number;
  }[];
}
