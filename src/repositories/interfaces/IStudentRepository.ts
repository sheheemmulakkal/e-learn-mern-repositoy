import { IStudent } from "../../common/types/student";

export interface IStudnetRepository {
    createStudent(studentDetails: IStudent): Promise<IStudent>;
    findStudentByEmail(email: string): Promise<IStudent | null>;
    updateUserVerification(email: string): Promise<IStudent>;
}