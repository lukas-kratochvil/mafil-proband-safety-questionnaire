import { useTranslation } from "react-i18next";
import { convertStringToLocalizationKey } from "@app/i18n/i18n";

type TranslatedTableCellProps = {
  localizationKey: string;
};

export const TranslatedTableCell = ({ localizationKey }: TranslatedTableCellProps) => {
  const { t } = useTranslation();
  return <>{t(convertStringToLocalizationKey(localizationKey))}</>;
};
