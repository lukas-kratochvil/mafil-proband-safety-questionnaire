import { Grid, ListItem, ListItemButton } from "@mui/material";
import { amber } from "@mui/material/colors";
import { useLocation } from "react-router-dom";
import { INavigationItem } from "../../Header";

interface INavigationMobileTabProps {
  tab: INavigationItem
}

export const NavigationMobileTab = ({ tab }: INavigationMobileTabProps) => {
  const location = useLocation();

  const isSelected = location.pathname.startsWith(tab.urlPrefix);
  const highlightColor = amber[600];

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={tab.onClick}
        sx={{
          paddingY: "1rem",
          color: "rgba(0, 0, 0, 1)",
          backgroundColor: isSelected ? highlightColor : undefined,
          opacity: 0.85,
          fontSize: "0.85rem",
          fontWeight: 500,
          letterSpacing: "0.02857rem",
          textTransform: "uppercase",
          "&:hover": {
            backgroundColor: highlightColor,
            opacity: 1,
          },
        }}
      >
        <Grid
          container
          alignItems="center"
          columnGap="1rem"
        >
          <Grid item>{tab.icon}</Grid>
          <Grid
            item
            xs
          >
            {tab.label}
          </Grid>
        </Grid>
      </ListItemButton>
    </ListItem>
  );
};
