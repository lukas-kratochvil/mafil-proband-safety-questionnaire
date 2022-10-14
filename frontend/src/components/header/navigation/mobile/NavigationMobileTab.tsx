import { Grid, ListItem, ListItemButton, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import { getCommonTabSx, ITabProps } from "../common";

export const NavigationMobileTab = ({ urlPrefix, label, onClick, Icon }: ITabProps) => {
  const theme = useTheme();
  const location = useLocation();

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        sx={{
          paddingY: "1rem",
          ...getCommonTabSx(theme, location, urlPrefix),
        }}
      >
        <Grid
          container
          alignItems="center"
          columnGap="1rem"
        >
          <Grid item>
            <Icon />
          </Grid>
          <Grid
            item
            xs
          >
            {label}
          </Grid>
        </Grid>
      </ListItemButton>
    </ListItem>
  );
};
