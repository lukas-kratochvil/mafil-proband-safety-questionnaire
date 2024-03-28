import { useTranslation } from "react-i18next";
import { convertStringToLocalizationKey, defaultNS } from "@app/i18n/i18n";

type TranslatedTableCellProps = {
  localizationKey: string;
};

export const TranslatedTableCell = ({ localizationKey }: TranslatedTableCellProps) => {
  const { t } = useTranslation(defaultNS);
  return <>{t(convertStringToLocalizationKey(localizationKey))}</>;
};
