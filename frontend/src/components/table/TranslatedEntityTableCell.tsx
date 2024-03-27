import { useTranslation } from "react-i18next";
import { type LanguageCode } from "@app/i18n/i18n";
import type { ITranslation } from "@app/util/server_API/dto";

const getTranslation = (translations: ITranslation[], languageCode: LanguageCode): string =>
  translations.find((trans) => trans.language.code === languageCode)?.text ?? "";

type ITranslatedEntityTableCellProps = {
  translations: ITranslation[];
};

export const TranslatedEntityTableCell = ({ translations }: ITranslatedEntityTableCellProps) => {
  const { i18n } = useTranslation();
  return <>{getTranslation(translations, i18n.language as LanguageCode)}</>;
};
