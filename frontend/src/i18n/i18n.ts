import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import cs from "./cs.json";
import en from "./en.json";

export const convertStringToLocalizationKey = (str: string): TemplateStringsArray =>
  str as unknown as TemplateStringsArray;

// TODO: is it necessary to use it explicitly in the translation function inside React components?
export const defaultNS = "translation";

// Object attributes must be ISO 639-1 language codes: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export const resources = {
  cs,
  en,
} as const;

/**
 * Localization supported for these ISO 639-1 language codes.
 */
export type LanguageCode = keyof typeof resources;

void i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    debug: process.env.NODE_ENV === "development",
    defaultNS,
    fallbackLng: "cs",
    interpolation: {
      escapeValue: false, // not needed for React as it escapes by default
    },
    react: {
      transEmptyNodeValue: "",
      transSupportBasicHtmlNodes: true,
    },
    // TODO: try to get {locale}.json files from the backend (https://www.i18next.com/how-to/add-or-load-translations)
    // sources:
    //    - https://stackoverflow.com/questions/56748722/how-can-we-load-translations-using-api-calls-instead-of-having-them-defined-in-s
    //    - https://stackoverflow.com/questions/43415899/cannot-get-react-i18next-to-read-json-files-via-fetch-backend
    //    - https://stackoverflow.com/questions/74774303/react-i18next-not-showing-translation-from-rest-api
    resources,
  });

export default i18n;
