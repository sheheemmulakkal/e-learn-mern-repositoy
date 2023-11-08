import { ILanguage } from "../../common/types/language";

export interface ILanguageRepository {
    createLanguage(language: string): Promise<ILanguage>;
    findLanguageByName(language: string): Promise<ILanguage | null>;
    findLanguageById(languageId: string): Promise<ILanguage | null>;
    updateLanguage(languageId: string, data: string): Promise<ILanguage>;
    listLanguage(languageId: string): Promise<ILanguage>;
    unlistLanguage(languageId: string): Promise<ILanguage>;
    getAllLanguages(): Promise<ILanguage[] | null>
}