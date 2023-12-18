import { IInstructorRepository } from "../interfaces/instructorRepository.interface";
import { IInstructor } from "../../common/types/instructor";
import { Instructor } from "../../models/instructorModel";
import { BadRequestError } from "../../common/errors/badRequestError";

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

  async updatePassword(
    instructorId: string,
    password: string
  ): Promise<IInstructor> {
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      throw new BadRequestError("Id not valid");
    }
    instructor.set({
      password,
    });
    return await instructor.save();
  }

  async addToWallet(
    instructorId: string,
    amount: number
  ): Promise<IInstructor> {
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      throw new BadRequestError("Instructor not found");
    }
    instructor.set({ wallet: (instructor.wallet ?? 0) + amount });

    return await instructor.save();
  }

  async addWalletHistory(
    instructorId: string,
    amount: number,
    description: string
  ): Promise<IInstructor> {
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      throw new BadRequestError("instructor not found");
    }
    const walletHistoryDetails = {
      amount,
      description,
      date: new Date(),
    };
    instructor.walletHistory?.push(walletHistoryDetails);
    return await instructor.save();
  }
  async getInstructorCount(): Promise<number> {
    return await Instructor.count();
  }
}
