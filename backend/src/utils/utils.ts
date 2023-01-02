import { Language } from "@prisma/client";
import { CreateTranslationInput } from "@language/dto/create-translation.input";

export const areTranslationsComplete = (languages: Language[], translations: CreateTranslationInput[]): boolean => {
  const translationLocales = translations.map((translation) => translation.locale);
  return languages.map((language) => language.locale).every((locale) => translationLocales.includes(locale));
};

export const areLocalesValid = (languages: Language[], translations: CreateTranslationInput[]): boolean => {
  const languageLocales = languages.map((language) => language.locale);
  return translations.map((translation) => translation.locale).every((locale) => languageLocales.includes(locale));
};
