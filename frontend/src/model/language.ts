import { MDB_ILanguageDTO } from "@app/util/mafildb_API/dto";

export interface ILanguage {
  id: MDB_ILanguageDTO["id"];
  nativeName: MDB_ILanguageDTO["name"];
  nameCs: MDB_ILanguageDTO["name_cs"];
  nameEn: MDB_ILanguageDTO["name_en"];
  code: MDB_ILanguageDTO["code"];
  priority: MDB_ILanguageDTO["priority"];
}

export type INativeLanguage = ILanguage;
