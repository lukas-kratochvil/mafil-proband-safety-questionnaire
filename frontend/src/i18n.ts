import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import cz from "./i18n/cz.json";
import en from "./i18n/en.json";

export const defaultNS = "translation";
export const resources = {
  cz,
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
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for React as it escapes by default
    },
    react: {
      transEmptyNodeValue: "", // what to return for empty Trans component
    },
    // TODO: try to get {locale}.json files from the backend (https://www.i18next.com/overview/configuration-options#languages-namespaces-resources)
    resources,
  });