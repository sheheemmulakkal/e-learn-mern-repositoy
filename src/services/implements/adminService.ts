import { IAdminService } from "../interfaces/adminService.interface";
import { AdminRepository } from "../../repositories/implements/adminRepository";
import { InstructorRepository } from "../../repositories/implements/intstructorRepository";
import { StudentRepository } from "../../repositories/implements/studentRepository";
import { IAdmin } from "../../common/types/admin";
import { IStudent } from "../../common/types/student";
import { IInstructor } from "../../common/types/instructor";
import { NotFoundError } from "../../common/errors/notFoundError";

export class AdminService implements IAdminService {
  private adminRepository: AdminRepository;
  private instructorRepository: InstructorRepository;
  private studentRepository: StudentRepository;
  constructor() {
    this.adminRepository = new AdminRepository();
    this.instructorRepository = new InstructorRepository();
    this.studentRepository = new StudentRepository();
  }

  async login(email: string): Promise<IAdmin> {
    const admin = await this.adminRepository.findAdminByEmail(email);
    if (!admin) {
      throw new NotFoundError("Email not found");
    } else {
      return admin;
    }
  }

  async getAllStudents(): Promise<IStudent[] | null> {
    return await this.studentRepository.getAllStudents();
  }

  async getAllInstructors(): Promise<IInstructor[] | null> {
    return await this.instructorRepository.getAllInstructors();
  }

  async blockStudent(studentId: string): Promise<IStudent> {
    return await this.studentRepository.blockStudent(studentId);
  }

  async unblockStudent(studentId: string): Promise<IStudent> {
    return await this.studentRepository.unblockStudent(studentId);
  }

  async blockInstructor(instructorId: string): Promise<IInstructor> {
    return await this.instructorRepository.blockInstructor(instructorId);
  }

  async unblockInstructor(instructorId: string): Promise<IInstructor> {
    return await this.instructorRepository.unblockInstructor(instructorId);    
  }
}
