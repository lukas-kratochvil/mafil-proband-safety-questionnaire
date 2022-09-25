import { AppBar, Box, Stack, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { dummyFantomVisitNew } from "../../data/visit_data";
import { useAuth } from "../../hooks/auth/Auth";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";
import { INavigationItem, Navigation } from "./Navigation";
import { NavigationMobile } from "./NavigationMobile";

const CeitecMafilLogo = () => {
  const theme = useTheme();
  const matchesOnlyXsBreakpoint = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Box
      component="img"
      alt="CEITEC-MAFIL logo"
      src="/logo_mafil.png"
      sx={{ height: matchesOnlyXsBreakpoint ? "2rem" : "3rem" }}
    />
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
    },
    {
      label: "Založit měření na Fantomu",
      onClick: () => {
        // TODO: create new FANTOM visit and use its ID
        const newFantomVisitId = dummyFantomVisitNew.id;
        navigate(`/auth/form/${newFantomVisitId}`);
      },
    },
    {
      label: "Otevřít formulář probanda",
      onClick: () => window.open("/", "_blank", "noopener,noreferrer"),
    },
    {
      label: "Poslední visity",
      onClick: () => navigate("/auth/recent-visits"),
    },
  ];

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          {matchesDownMdBreakpoint ? (
            <>
              <NavigationMobile items={navigationItems} />
              <CeitecMafilLogo />
              <LanguageMenu />
            </>
          ) : (
            <>
              <CeitecMafilLogo />
              {username !== undefined && <LoginOperator />}
              <LanguageMenu />
            </>
          )}
        </Stack>
      </Toolbar>
      {!matchesDownMdBreakpoint && username !== undefined && <Navigation items={navigationItems} />}
    </AppBar>
  );
};
