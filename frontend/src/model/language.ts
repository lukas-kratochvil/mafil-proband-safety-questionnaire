import type { MDB_ILanguageDTO } from "@app/util/mafildb_API/dto";

export type ILanguage = {
  code: MDB_ILanguageDTO["code"];
  nativeName: MDB_ILanguageDTO["name"];
  nameCs: MDB_ILanguageDTO["name_cs"];
  nameEn: MDB_ILanguageDTO["name_en"];
  priority: MDB_ILanguageDTO["priority"];
};

export type INativeLanguage = ILanguage;
