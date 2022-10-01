import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ScienceIcon from "@mui/icons-material/Science";
import { AppBar, Box, Grid, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { dummyFantomVisitNew } from "../../data/visit_data";
import { useAuth } from "../../hooks/auth/Auth";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";
import { Navigation } from "./Navigation";
import { NavigationMobile } from "./NavigationMobile";

export interface INavigationItem {
  label: string;
  onClick: () => void;
  icon: ReactElement;
}

const CeitecMafilLogo = () => {
  const theme = useTheme();
  const matchesOnlyXsBreakpoint = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Box display="flex">
      <Box
        component="img"
        alt="CEITEC-MAFIL logo"
        src="/logo_mafil.png"
        sx={{ height: matchesOnlyXsBreakpoint ? "2.25rem" : "3rem" }}
      />
    </Box>
  );
};

export const Header = () => {
  const { username } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchesDownMdBreakpoint = useMediaQuery(theme.breakpoints.down("md"));

  const navigationItems: INavigationItem[] = [
    {
      // TODO: number must be updated
      label: "Čekárna (2)",
      onClick: () => navigate("/auth/waiting-room"),
      icon: <PendingActionsIcon />,
    },
    {
      label: "Založit měření na Fantomu",
      onClick: () => {
        // TODO: create new FANTOM visit and use its ID
        const newFantomVisitId = dummyFantomVisitNew.id;
        navigate(`/auth/form/${newFantomVisitId}`);
      },
      icon: <ScienceIcon />,
    },
    {
      label: "Otevřít formulář probanda",
      onClick: () => window.open("/", "_blank", "noopener,noreferrer"),
      icon: <PersonAddAlt1Icon />,
    },
    {
      label: "Poslední visity",
      onClick: () => navigate("/auth/recent-visits"),
      icon: <RecentActorsIcon />,
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
          {username === undefined ? (
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
      {!matchesDownMdBreakpoint && username !== undefined && <Navigation items={navigationItems} />}
    </AppBar>
  );
};
