import { IInstructor } from "../../common/types/instructor";
export interface IInstructorService {
    signup(instructorDetails: IInstructor): Promise<IInstructor>;
    login(email: string): Promise<IInstructor>;
    verifyInstructor(email: string): Promise<IInstructor>;
}