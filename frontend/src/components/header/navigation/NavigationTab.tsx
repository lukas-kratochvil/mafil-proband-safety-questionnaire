import { Tab } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { convertStringToLocalizationKey } from "@app/i18n/i18n";
import { getCommonTabSx, type TabProps } from "./tabs";

export const NavigationTab = ({ localizationKey, urlPrefix, onClick }: TabProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "common.navigation" });
  const location = useLocation();

  return (
    <Tab
      label={t(convertStringToLocalizationKey(localizationKey))}
      onClick={onClick}
      sx={{ ...getCommonTabSx(location, urlPrefix) }}
    />
  );
};
