import { Grid, ListItem, ListItemButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { convertStringToLocalizationKey, defaultNS } from "@app/i18n/i18n";
import { getCommonTabSx, type TabProps } from "../tabs";

export const NavigationMobileTab = ({ localizationKey, urlPrefix, onClick, Icon }: TabProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "common.navigation" });
  const location = useLocation();

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        sx={{
          paddingY: "1rem",
          ...getCommonTabSx(location, urlPrefix),
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
