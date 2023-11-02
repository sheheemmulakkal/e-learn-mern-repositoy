import { IStudent } from "../../common/types/student";

export interface IStudnetRepository {
    createStudent(studentDetails: IStudent): Promise<IStudent>;
    findStudentByEmail(email: string): Promise<IStudent | null>;
    updateUserVerification(email: string): Promise<IStudent>;
    getAllStudents(): Promise<IStudent[] | null>
    blockStudent(studentId: string): Promise<IStudent | null>;
    unblockStudent(studentId: string): Promise<IStudent | null>;
}