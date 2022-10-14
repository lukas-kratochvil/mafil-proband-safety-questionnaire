import ApprovalIcon from "@mui/icons-material/Approval";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ScienceIcon from "@mui/icons-material/Science";
import { AppBar, Grid, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { UrlBasePaths } from "../../App";
import { useAuth } from "../../hooks/auth/Auth";
import { CeitecMafilLogo } from "./CeitecMafilLogo";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";
import { Navigation } from "./Navigation";
import { NavigationMobile } from "./NavigationMobile";

export interface INavigationItem {
  urlPrefix: string;
  label: string;
  onClick: () => void;
  icon: ReactElement;
}

export const Header = () => {
  const { operator } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchesDownMdBreakpoint = useMediaQuery(theme.breakpoints.down("md"));

  // TODO: extract outside the component?
  const navigationItems: INavigationItem[] = [
    {
      urlPrefix: UrlBasePaths.WAITING_ROOM,
      // TODO: number must be updated
      label: "Čekárna (?)",
      onClick: () => navigate(UrlBasePaths.WAITING_ROOM),
      icon: <PendingActionsIcon />,
    },
    {
      urlPrefix: UrlBasePaths.APPROVAL,
      // TODO: number must be updated
      label: "Ke schválení (?)",
      onClick: () => navigate(UrlBasePaths.APPROVAL),
      icon: <ApprovalIcon />,
    },
    {
      urlPrefix: UrlBasePaths.RECENT_VISITS,
      label: "Poslední visity",
      onClick: () => navigate(UrlBasePaths.RECENT_VISITS),
      icon: <RecentActorsIcon />,
    },
    {
      urlPrefix: UrlBasePaths.FANTOM_FORM,
      label: "Založit měření na Fantomu",
      onClick: () => navigate(UrlBasePaths.FANTOM_FORM),
      icon: <ScienceIcon />,
    },
    {
      urlPrefix: UrlBasePaths.PROBAND_FORM,
      label: "Otevřít formulář probanda",
      onClick: () => window.open(UrlBasePaths.PROBAND_FORM, "_blank", "noopener,noreferrer"),
      icon: <PersonAddAlt1Icon />,
    },
  ];

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
                {matchesDownMdBreakpoint ? <NavigationMobile items={navigationItems} /> : <CeitecMafilLogo />}
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
      {!matchesDownMdBreakpoint && operator !== undefined && <Navigation items={navigationItems} />}
    </AppBar>
  );
};
