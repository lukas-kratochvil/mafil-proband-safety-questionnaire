import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import type { ArrayToUnion } from "@app/types";

export const convertStringToLocalizationKey = (str: string): TemplateStringsArray =>
  str as unknown as TemplateStringsArray;

// Supported languages in our app.
// Order of languages matters - the first language is used as the fallback language.
const supportedLanguages = ["cs", "en"] as const;

/**
 * Localization supported for these ISO 639-1 language codes.
 */
export type LanguageCode = ArrayToUnion<typeof supportedLanguages>;

/**
 * Default i18n translation namespace.
 */
export const defaultNS = "translation";

void i18n
  // detect user language
  .use(LanguageDetector)
  // load translations from public/locales
  .use(Backend)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    debug: import.meta.env.DEV && import.meta.env.MODE !== "test",
    defaultNS,
    supportedLngs: supportedLanguages,
    fallbackLng: supportedLanguages[0],
    interpolation: {
      escapeValue: false, // not needed for React as it escapes by default
    },
    react: {
      transEmptyNodeValue: "",
      transSupportBasicHtmlNodes: true,
    },
  });

export default i18n;
