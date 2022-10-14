import { Grid, ListItem, ListItemButton } from "@mui/material";
import { amber } from "@mui/material/colors";
import { INavigationItem } from "../../Header";

interface INavigationMobileTabProps {
  tab: INavigationItem
}

export const NavigationMobileTab = ({ tab }: INavigationMobileTabProps) => (
  <ListItem disablePadding>
    <ListItemButton
      onClick={tab.onClick}
      sx={{
        paddingY: "1rem",
        color: "rgba(0, 0, 0, 1)",
        opacity: 0.85,
        fontSize: "0.85rem",
        fontWeight: 500,
        letterSpacing: "0.02857rem",
        textTransform: "uppercase",
        "&:hover": {
          backgroundColor: amber[600],
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
