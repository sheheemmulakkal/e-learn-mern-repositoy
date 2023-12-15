import { IChapter, IModule } from "../../common/types/module";
import { Module } from "../../models/moduleModel";
import { IModuleRepository } from "../interfaces/moduleRepository.interface";

export class ModuleRepository implements IModuleRepository {
  async createModule(moduleDetails: IModule): Promise<IModule> {
    const module = Module.build(moduleDetails);
    return await module.save();
  }
  async findModuleById(moduleId: string): Promise<IModule | null> {
    return await Module.findById(moduleId);
  }
  async updateModule(moduleDetails: IModule): Promise<IModule> {
    const { id, name, description, module } = moduleDetails;
    const existingModule = await Module.findById(id);
    existingModule!.set({
      name,
      description,
      module,
    });
    return await existingModule!.save();
  }
  async listModule(moduleId: string): Promise<IModule> {
    const module = await Module.findById(moduleId);
    module!.set({ status: true });
    return await module!.save();
  }
  async unlistModule(moduleId: string): Promise<IModule> {
    const module = await Module.findById(moduleId);
    module!.set({ status: false });
    return await module!.save();
  }
  async addChapter(moduleId: string, chapter: IChapter): Promise<IModule> {
    const module = await Module.findById(moduleId);
    module?.chapters?.push(chapter);
    return await module!.save();
  }
}
