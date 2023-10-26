import { IStudent } from "../../common/types/student";
export interface IStudentService {
    signup(studentDetails: IStudent): Promise<IStudent>;
    login(email: string): Promise<IStudent>;
    verifyStudent(email: string): Promise<IStudent>;
}