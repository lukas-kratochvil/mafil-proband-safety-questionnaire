import { Tab } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { defaultNS } from "../../../i18n";
import { getCommonTabSx, ITabProps } from "./common";

export const NavigationTab = ({ localizationKey, urlPrefix, onClick, showCount }: ITabProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "common.navigation" });
  const location = useLocation();

  return (
    <Tab
      // TODO: number must be updated
      label={`${t(localizationKey as unknown as TemplateStringsArray)}${showCount ? " (?)" : ""}`}
      onClick={onClick}
      sx={{ ...getCommonTabSx(location, urlPrefix) }}
    />
  );
};
