import { IAdminRepository } from "../interfaces/adminRepository.interface";
import { IAdmin } from "../../common/types/admin";
import { Admin } from "../../models/adminModel";

export class AdminRepository implements IAdminRepository {
  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email });
  }
}
