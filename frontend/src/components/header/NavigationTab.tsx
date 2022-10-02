import { Tab, useTheme } from "@mui/material";
import { amber } from "@mui/material/colors";
import { INavigationItem } from "./Header";

interface INavigationTabProps {
  tab: INavigationItem;
}

export const NavigationTab = ({ tab }: INavigationTabProps) => {
  const theme = useTheme();

  return (
    <Tab
      label={tab.label}
      onClick={tab.onClick}
      sx={{
        color: theme.palette.text.primary,
        opacity: 0.85,
        "&:hover": {
          backgroundColor: amber[600],
          opacity: 1,
        },
      }}
    />
  );
};
