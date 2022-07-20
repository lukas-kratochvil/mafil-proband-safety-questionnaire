import { AppBar, Link, Stack, Toolbar } from "@mui/material";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width={"100%"}
        >
          <Link
            href="https://mafil.ceitec.cz/"
            rel="noopener noreferrer"
            sx={{ lineHeight: "0px" }}
          >
            <img
              src="/logo_mafil.png"
              alt="CEITEC-MAFIL logo"
              height={40}
            />
          </Link>
          <LoginOperator />
          <LanguageMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
