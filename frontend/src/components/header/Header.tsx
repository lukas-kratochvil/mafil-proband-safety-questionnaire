import { AppBar, Box, Stack, Toolbar } from "@mui/material";
import { useAuth } from "../../hooks/auth/Auth";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";

export const Header = () => {
  const { username } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box
            component="img"
            alt="CEITEC-MAFIL logo"
            src="/logo_mafil.png"
            sx={{
              height: "3rem",
            }}
          />
          {username !== undefined && <LoginOperator />}
          <LanguageMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
