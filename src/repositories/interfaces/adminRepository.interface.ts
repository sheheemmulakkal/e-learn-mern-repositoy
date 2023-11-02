import { IAdmin } from "../../common/types/admin";

export interface IAdminRepository {
    findAdminByEmail(email: string): Promise<IAdmin | null>;
}