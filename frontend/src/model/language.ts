import type { MDB_LanguageDTO } from "@app/util/mafildb_API/dto";

export type Language = {
  code: MDB_LanguageDTO["code"];
  nativeName: MDB_LanguageDTO["name"];
  nameCs: MDB_LanguageDTO["name_cs"];
  nameEn: MDB_LanguageDTO["name_en"];
  priority: MDB_LanguageDTO["priority"];
};

export type NativeLanguage = Language;
