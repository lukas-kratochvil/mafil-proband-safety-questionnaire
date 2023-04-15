import { useTranslation } from "react-i18next";
import { LanguageCode } from "@app/i18n";
import { ITranslation } from "@app/util/server_API/dto";
import { getTranslation } from "@app/util/utils";

interface ITranslatedTableCellProps {
  translations: ITranslation[];
}

export const TranslatedTableCell = ({ translations }: ITranslatedTableCellProps) => {
  const { i18n } = useTranslation();
  return <>{getTranslation(translations, i18n.language as LanguageCode)}</>;
};
