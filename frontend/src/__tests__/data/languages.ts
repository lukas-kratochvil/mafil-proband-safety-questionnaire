import { ILanguage, INativeLanguage } from "@app/model/language";

const languagesTest: ILanguage[] = [
  {
    id: 1,
    nativeName: "Čeština",
    nameCs: "Čeština",
    nameEn: "Czech",
    code: "cs",
    priority: 1,
  },
  {
    id: 2,
    nativeName: "Slovenčina",
    nameCs: "Slovenština",
    nameEn: "Slovak",
    code: "sk",
    priority: 2,
  },
  {
    id: 3,
    nativeName: "English",
    nameCs: "Angličtina",
    nameEn: "English",
    code: "en",
    priority: 3,
  },
];

export const nativeLanguagesTest: INativeLanguage[] = languagesTest;
