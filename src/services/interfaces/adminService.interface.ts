import { IAdmin } from "../../common/types/admin";
import { IStudent } from "../../common/types/student";
import { IInstructor } from "../../common/types/instructor";

export interface IAdminService {
    login(email: string): Promise<IAdmin>;
    getAllStudents(): Promise<IStudent[] | null>;
    getAllInstructors(): Promise<IInstructor[] | null>;
    blockStudent(studentId: string): Promise<IStudent>;
    unblockStudent(studentId: string): Promise<IStudent>;
    blockInstructor(instructorId: string): Promise<IInstructor>;
    unblockInstructor(instructorId: string): Promise<IInstructor>;
    
}