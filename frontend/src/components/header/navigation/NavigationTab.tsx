import { Tab } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { convertStringToLocalizationKey } from "@app/i18n/i18n";
import { getCommonTabSx, type TabProps } from "./tabs";

export const NavigationTab = ({ localizationKey, urlPath, openInNewWindow }: TabProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "common.navigation" });
  const location = useLocation();

  return (
    <Tab
      label={t(convertStringToLocalizationKey(localizationKey))}
      component={Link}
      to={urlPath}
      target={openInNewWindow ? "_blank" : undefined}
      rel={openInNewWindow ? "noopener noreferrer" : undefined}
      sx={{ ...getCommonTabSx(location, urlPath) }}
    />
  );
};
