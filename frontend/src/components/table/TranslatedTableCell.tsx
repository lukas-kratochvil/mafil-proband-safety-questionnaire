import { useTranslation } from "react-i18next";
import { convertStringToLocalizationKey, defaultNS } from "@app/i18n/i18n";

type ITranslatedTableCellProps = {
  localizationKey: string;
};

export const TranslatedTableCell = ({ localizationKey }: ITranslatedTableCellProps) => {
  const { t } = useTranslation(defaultNS);
  return <>{t(convertStringToLocalizationKey(localizationKey))}</>;
};
