import { Tab } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { convertStringToLocalizationKey, defaultNS } from "@app/i18n/i18n";
import { getCommonTabSx, type ITabProps } from "./common";

export const NavigationTab = ({ localizationKey, urlPrefix, onClick }: ITabProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "common.navigation" });
  const location = useLocation();

  return (
    <Tab
      label={t(convertStringToLocalizationKey(localizationKey))}
      onClick={onClick}
      sx={{ ...getCommonTabSx(location, urlPrefix) }}
    />
  );
};
