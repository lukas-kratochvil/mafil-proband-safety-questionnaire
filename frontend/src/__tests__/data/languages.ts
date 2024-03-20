import { ILanguage, INativeLanguage } from "@app/model/language";

const languagesTest: ILanguage[] = [
  {
    code: "cs",
    nativeName: "Čeština",
    nameCs: "Čeština",
    nameEn: "Czech",
    priority: 1,
  },
  {
    code: "sk",
    nativeName: "Slovenčina",
    nameCs: "Slovenština",
    nameEn: "Slovak",
    priority: 2,
  },
  {
    code: "en",
    nativeName: "English",
    nameCs: "Angličtina",
    nameEn: "English",
    priority: 3,
  },
];

export const nativeLanguagesTest: INativeLanguage[] = languagesTest;
