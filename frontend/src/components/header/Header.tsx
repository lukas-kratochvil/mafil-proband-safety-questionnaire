import { AppBar, Grid, Toolbar, useMediaQuery, type Theme } from "@mui/material";
import { lazy } from "react";
import { getConfig } from "@app/config/config";
import { useAuth } from "@app/hooks/auth/auth";
import { CeitecMafilLogo } from "./CeitecMafilLogo";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";
import { NavigationMobile } from "./navigation/mobile/NavigationMobile";

const Navigation = lazy(() => import("./navigation/Navigation"));

export const Header = () => {
  const { operator } = useAuth();
  const matchesDownMdBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: import.meta.env.PROD ? getConfig().appBarColor : undefined,
      }}
    >
      <Toolbar variant="dense">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          {operator === undefined ? (
            <Grid
              item
              xs
            >
              <CeitecMafilLogo />
            </Grid>
          ) : (
            <>
              <Grid
                item
                xs
              >
                {matchesDownMdBreakpoint ? <NavigationMobile /> : <CeitecMafilLogo />}
              </Grid>
              <Grid
                item
                xs="auto"
              >
                {matchesDownMdBreakpoint ? <CeitecMafilLogo /> : <LoginOperator />}
              </Grid>
            </>
          )}
          <Grid
            item
            xs
          >
            <LanguageMenu />
          </Grid>
        </Grid>
      </Toolbar>
      {!matchesDownMdBreakpoint && operator && <Navigation />}
    </AppBar>
  );
};
