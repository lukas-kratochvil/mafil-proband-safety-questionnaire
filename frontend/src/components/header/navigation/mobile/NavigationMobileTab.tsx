import { Grid, ListItem, ListItemButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { convertStringToLocalizationKey } from "@app/i18n/i18n";
import { getCommonTabSx, type TabProps } from "../tabs";

export const NavigationMobileTab = ({ localizationKey, urlPath, Icon, openInNewWindow }: TabProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "common.navigation" });
  const location = useLocation();

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={urlPath}
        target={openInNewWindow ? "_blank" : undefined}
        rel={openInNewWindow ? "noopener noreferrer" : undefined}
        sx={{
          paddingY: "1rem",
          ...getCommonTabSx(location, urlPath),
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
            {t(convertStringToLocalizationKey(localizationKey))}
          </Grid>
        </Grid>
      </ListItemButton>
    </ListItem>
  );
};
