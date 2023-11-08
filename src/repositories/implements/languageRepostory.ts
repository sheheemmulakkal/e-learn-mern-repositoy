import { Language } from "../../models/languageModel";
import { ILanguage } from "../../common/types/language";
import { ILanguageRepository } from "../interfaces/languageRepository.interface";

export class LanguageRepostory implements ILanguageRepository {
  async createLanguage(data: string): Promise<ILanguage> {
    const language = Language.build({ language: data });
    return await language.save();
  }
  async findLanguageByName(language: string): Promise<ILanguage | null> {
    return await Language.findOne({ language });
  }
  async findLanguageById(languageId: string): Promise<ILanguage | null> {
    return await Language.findById(languageId);
  }
  async updateLanguage(languageId: string, data: string): Promise<ILanguage> {
    const language = await Language.findById(languageId);
    language!.set({
      language: data,
    });
    return await language!.save();
  }
  async listLanguage(languageId: string): Promise<ILanguage> {
    const language = await Language.findById(languageId);
    language!.set({
      status: true,
    });
    return await language!.save();
  }
  async unlistLanguage(languageId: string): Promise<ILanguage> {
    const language = await Language.findById(languageId);
    language!.set({
      status: false,
    });
    return await language!.save();
  }
  async getAllLanguages(): Promise<ILanguage[] | null> {
    return await Language.find();
  }
}
