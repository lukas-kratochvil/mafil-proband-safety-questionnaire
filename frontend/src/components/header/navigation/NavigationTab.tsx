import { Tab, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import { getCommonTabSx, ITabProps } from "./common";

export const NavigationTab = ({ urlPrefix, label, onClick }: ITabProps) => {
  const theme = useTheme();
  const location = useLocation();

  return (
    <Tab
      label={label}
      onClick={onClick}
      sx={{ ...getCommonTabSx(theme, location, urlPrefix) }}
    />
  );
};
