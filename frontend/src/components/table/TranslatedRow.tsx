import { useTranslation } from "react-i18next";
import { LocalizationKeys } from "@app/i18n";
import { ITranslation } from "@app/util/server_API/dto";
import { getTranslation } from "@app/util/utils";

interface ITranslatedTableRowProps {
  translations: ITranslation[];
}

export const TranslatedTableRow = ({ translations }: ITranslatedTableRowProps) => {
  const { i18n } = useTranslation();

  return <>{getTranslation(translations, i18n.language as LocalizationKeys)}</>;
};
