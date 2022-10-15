import { AppBar, Grid, Theme, Toolbar, useMediaQuery } from "@mui/material";
import { useAuth } from "../../hooks/auth/Auth";
import { CeitecMafilLogo } from "./CeitecMafilLogo";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";
import { Navigation } from "./navigation/Navigation";
import { NavigationMobile } from "./navigation/mobile/NavigationMobile";

export const Header = () => {
  const { operator } = useAuth();
  const matchesDownMdBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <AppBar position="static">
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
