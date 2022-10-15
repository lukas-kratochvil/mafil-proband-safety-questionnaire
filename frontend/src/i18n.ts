import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {};

export const availableLanguages = Object.keys(resources);

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: "cz",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
  });
