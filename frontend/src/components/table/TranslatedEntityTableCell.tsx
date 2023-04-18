import { useTranslation } from "react-i18next";
import { LanguageCode } from "@app/i18n";
import { ITranslation } from "@app/util/server_API/dto";
import { getTranslation } from "@app/util/utils";

interface ITranslatedEntityTableCellProps {
  translations: ITranslation[];
}

export const TranslatedEntityTableCell = ({ translations }: ITranslatedEntityTableCellProps) => {
  const { i18n } = useTranslation();
  return <>{getTranslation(translations, i18n.language as LanguageCode)}</>;
};
