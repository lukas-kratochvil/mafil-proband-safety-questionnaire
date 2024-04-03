import { AppBar, Grid, Toolbar, useMediaQuery, type Theme } from "@mui/material";
import { lazy } from "react";
import { useAuth } from "@app/hooks/auth/AuthProvider";
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
        backgroundColor: import.meta.env.VITE_APP_BAR_COLOR ?? "#7ac143",
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
      {!matchesDownMdBreakpoint && operator !== undefined && <Navigation />}
    </AppBar>
  );
};
