import ApprovalIcon from "@mui/icons-material/Approval";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ScienceIcon from "@mui/icons-material/Science";
import { AppBar, Grid, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/Auth";
import { CeitecMafilLogo } from "./CeitecMafilLogo";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";
import { Navigation } from "./Navigation";
import { NavigationMobile } from "./NavigationMobile";

export interface INavigationItem {
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
      // TODO: number must be updated
      label: "Čekárna (?)",
      onClick: () => navigate("/auth/waiting-room"),
      icon: <PendingActionsIcon />,
    },
    {
      // TODO: number must be updated
      label: "Ke schválení (?)",
      onClick: () => navigate("/auth/approval"),
      icon: <ApprovalIcon />,
    },
    {
      label: "Poslední visity",
      onClick: () => navigate("/auth/recent-visits"),
      icon: <RecentActorsIcon />,
    },
    {
      label: "Založit měření na Fantomu",
      onClick: () => navigate("/auth/fantom-form"),
      icon: <ScienceIcon />,
    },
    {
      label: "Otevřít formulář probanda",
      onClick: () => window.open("/form", "_blank", "noopener,noreferrer"),
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
