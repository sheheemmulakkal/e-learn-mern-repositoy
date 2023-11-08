import { Level } from "../../models/levelModel";
import { ILevel } from "../../common/types/level";
import { ILevelRepository } from "../interfaces/levelRepository.interface";

export class LevelRepository implements ILevelRepository {
  async createLevel(data: string): Promise<ILevel> {
    const level = Level.build({ level: data });
    return await level.save();
  }
  async findLevelById(levelId: string): Promise<ILevel | null> {
    return await Level.findById(levelId);
  }
  async findLevelByName(level: string): Promise<ILevel | null> {
    return await Level.findOne({ level });
  }
  async updateLevel(levelId: string, data: string): Promise<ILevel> {
    const level = await Level.findById(levelId);
    level!.set({
      level: data,
    });
    return await level!.save();
  }
  async listLevel(levelId: string): Promise<ILevel> {
    const level = await Level.findById(levelId);
    level!.set({
      status: true,
    });
    return await level!.save();
  }
  async unlistLevel(levelId: string): Promise<ILevel> {
    const level = await Level.findById(levelId);
    level!.set({
      status: false,
    });
    return await level!.save();
  }
  async getAllLevels(): Promise<ILevel[] | null> {
    return Level.find();
  }
}
