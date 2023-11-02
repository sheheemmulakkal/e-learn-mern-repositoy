import { IInstructorRepository } from "../interfaces/instructorRepository.interface";
import { IInstructor } from "../../common/types/instructor";
import { Instructor } from "../../models/instructorModel";

export class InstructorRepository implements IInstructorRepository {
  async createInstructor(instructorDetails: IInstructor): Promise<IInstructor> {
    const instructor = Instructor.build(instructorDetails);
    return await instructor.save();
  }

  async findInstructorByEmail(email: string): Promise<IInstructor | null> {
    return await Instructor.findOne({ email });
  }

  async updateInstructorVerification(email: string): Promise<IInstructor> {
    const instructor = await Instructor.findOne({ email });
    instructor!.set({ isVerified: true });
    return await instructor!.save();
  }

  async getAllInstructors(): Promise<IInstructor[] | null> {
    return await Instructor.find();
  }

  async blockInstructor(instructorId: string): Promise<IInstructor> {
    const instructor = await Instructor.findOne({ _id: instructorId });
    instructor!.set({ isBlocked: true });
    return await instructor!.save();
  }

  async unblockInstructor(instructorId: string): Promise<IInstructor> {
    const instructor = await Instructor.findOne({ _id: instructorId });
    instructor!.set({ isBlocked: false });
    return await instructor!.save();
  }
}