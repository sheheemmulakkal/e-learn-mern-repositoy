import { IInstructorService } from "../interfaces/instructorService.interface";
import { InstructorRepository } from "../../repositories/implements/intstructorRepository";
import { IInstructor } from "../../common/types/instructor";
import { BadRequestError } from "../../common/errors/badRequestError";
import { NotFoundError } from "../../common/errors/notFoundError";

export class InstructorSerivce implements IInstructorService {
  private instructorRepository: InstructorRepository;
  constructor() {
    this.instructorRepository = new InstructorRepository();
  }
  async signup(instructorDetails: IInstructor): Promise<IInstructor> {
    const existingInstructor = await this.instructorRepository.findInstructorByEmail(instructorDetails.email);
    if(existingInstructor){
      throw new BadRequestError("Instructor already exist");
    } else {
      return await this.instructorRepository.createInstructor(instructorDetails);
    }
  }

  async login(email: string): Promise<IInstructor>{
    const instructor = await this.instructorRepository.findInstructorByEmail(email);
    if(!instructor) {
      throw new NotFoundError("Email not found");
    } else {
      return instructor;
    }
  }

  async verifyStudent(email: string): Promise<IInstructor> {
    return await this.instructorRepository.updateInstructorVerification(email);
  }
}