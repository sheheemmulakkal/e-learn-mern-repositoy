export interface ISearch {
  category?: string;
  level?: string;
  language?: string;
  $or?: (
    | { name: { $regex: string; $options: string } }
    | { description: { $regex: string; $options: string } }
  )[];
}
