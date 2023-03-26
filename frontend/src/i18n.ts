import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import cs from "@app/i18n/cs.json";
import en from "@app/i18n/en.json";

export const convertStringToLocalizationKey = (str: string): TemplateStringsArray =>
  str as unknown as TemplateStringsArray;

export const defaultNS = "translation";
export const resources = {
  cs,
  en,
} as const;

export type LocalizationKeys = keyof typeof resources;

i18n
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
    // TODO: try to get {locale}.json files from the backend (https://www.i18next.com/overview/configuration-options#languages-namespaces-resources)
    resources,
  });

export default i18n;
