import { ITranslatedEntity } from "@app/util/server_API/dto";

export type GenderCode = "M" | "F" | "O";

export type HandednessCode = "r" | "l" | "rl" | "u";

export const compareGenders = (a: ITranslatedEntity, b: ITranslatedEntity, _locale: string): number => {
  const aCode = a.code as GenderCode;
  const bCode = b.code as GenderCode;
  return aCode === "M" || (aCode === "F" && bCode !== "M") ? -1 : 1;
};

export const compareNativeLanguages = (a: ITranslatedEntity, b: ITranslatedEntity, locale: string): number => {
  if (a.order && b.order) {
    return a.order - b.order;
  }
  if (a.order) {
    return -1;
  }
  if (b.order) {
    return 1;
  }

  const aText = a.translations.find((trans) => trans.language.code === locale)?.text || undefined;
  const bText = b.translations.find((trans) => trans.language.code === locale)?.text || undefined;
  return aText === undefined || bText === undefined ? -1 : new Intl.Collator(locale).compare(aText, bText);
};

export const compareHandednesses = (a: ITranslatedEntity, b: ITranslatedEntity, _locale: string): number => {
  const aCode = a.code as HandednessCode;
  const bCode = b.code as HandednessCode;

  if (aCode === "r") {
    return -1;
  }
  if (bCode === "r") {
    return 1;
  }
  return aCode === "l" || (aCode === "rl" && bCode !== "l") ? -1 : 1;
};
