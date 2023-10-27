import { IInstructor } from "../../common/types/instructor";

export interface IInstructorRepository {
    createInstructor(instructorDetails: IInstructor): Promise<IInstructor>;
    findInstructorByEmail(email: string): Promise<IInstructor | null>;
    updateInstructorVerification(email: string): Promise<IInstructor>;
}