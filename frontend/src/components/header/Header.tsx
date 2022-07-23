import { AppBar, Link, Stack, Toolbar } from "@mui/material";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";

interface IHeaderProps {
  isAuthenticated: boolean;
}

export const Header = ({ isAuthenticated }: IHeaderProps) => {
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
          {isAuthenticated && <LoginOperator /> }
          <LanguageMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
