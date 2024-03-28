import { useTranslation } from "react-i18next";
import type { LanguageCode } from "@app/i18n/i18n";
import type { Translation } from "@app/util/server_API/dto";

const getTranslation = (translations: Translation[], languageCode: LanguageCode): string =>
  translations.find((trans) => trans.language.code === languageCode)?.text ?? "";

type TranslatedEntityTableCellProps = {
  translations: Translation[];
};

export const TranslatedEntityTableCell = ({ translations }: TranslatedEntityTableCellProps) => {
  const { i18n } = useTranslation();
  return <>{getTranslation(translations, i18n.language as LanguageCode)}</>;
};
