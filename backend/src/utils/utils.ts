import { Language } from "@prisma/client";
import { CreateTranslationInput } from "@language/dto/create-translation.input";

export const areTranslationsComplete = (languages: Language[], translations: CreateTranslationInput[]): boolean => {
  const translationCodes = translations.map((translation) => translation.code);
  return languages.map((language) => language.code).every((code) => translationCodes.includes(code));
};

export const areUpdateCodesValid = (
  languages: Language[],
  translations: CreateTranslationInput[] | undefined
): boolean => {
  if (translations === undefined) {
    return true;
  }

  const languageCodes = languages.map((language) => language.code);
  return translations.map((translation) => translation.code).every((code) => languageCodes.includes(code));
};
