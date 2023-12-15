import { IChapter, IModule } from "../../common/types/module";

export interface IModuleRepository {
  createModule(moduleDetails: IModule): Promise<IModule>;
  updateModule(moduleDetails: IModule): Promise<IModule>;
  findModuleById(moduleId: string): Promise<IModule | null>;
  listModule(moduleId: string): Promise<IModule>;
  unlistModule(moduleId: string): Promise<IModule>;
  addChapter(moduleId: string, chapter: IChapter): Promise<IModule>;
}
