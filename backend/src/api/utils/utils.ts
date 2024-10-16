import { Language } from "@prisma/client";
import { TranslationInput } from "@app/api/utils/dto/create-translation.input";

export const translationsSelect = {
  select: {
    text: true,
    language: true,
  },
};

export const areTranslationsComplete = (languages: Language[], translations: TranslationInput[]): boolean => {
  const translationCodes = translations.map((translation) => translation.code);
  return languages.map((language) => language.code).every((code) => translationCodes.includes(code));
};

export const areUpdateCodesValid = (languages: Language[], translations: TranslationInput[] | undefined): boolean => {
  if (translations === undefined) {
    return true;
  }

  const languageCodes = languages.map((language) => language.code);
  return translations.map((translation) => translation.code).every((code) => languageCodes.includes(code));
};
