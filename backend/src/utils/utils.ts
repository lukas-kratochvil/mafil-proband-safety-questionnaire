import { Language } from "@prisma/client";
import { CreateTranslationInput } from "@language/dto/create-translation.input";

export const areTranslationsComplete = (languages: Language[], translations: CreateTranslationInput[]): boolean => {
  const translationLocales = translations.map((translation) => translation.locale);
  return languages.map((language) => language.locale).every((locale) => translationLocales.includes(locale));
};
