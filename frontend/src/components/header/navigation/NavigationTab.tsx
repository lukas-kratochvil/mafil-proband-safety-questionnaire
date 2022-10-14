import { Tab, useTheme } from "@mui/material";
import { amber } from "@mui/material/colors";
import { useLocation } from "react-router-dom";
import { INavigationItem } from "../Header";

interface INavigationTabProps {
  tab: INavigationItem;
}

export const NavigationTab = ({ tab }: INavigationTabProps) => {
  const theme = useTheme();
  const location = useLocation();

  const isSelected = location.pathname.startsWith(tab.urlPrefix);
  const highlightColor = amber[600];

  return (
    <Tab
      label={tab.label}
      onClick={tab.onClick}
      sx={{
        color: theme.palette.text.primary,
        backgroundColor: isSelected ? highlightColor : undefined,
        opacity: 0.85,
        "&:hover": {
          backgroundColor: highlightColor,
          opacity: 1,
        },
      }}
    />
  );
};
