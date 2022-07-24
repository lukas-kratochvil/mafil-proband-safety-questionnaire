import { AppBar, Link, Stack, Toolbar } from "@mui/material";
import { IAuth } from "../../App";
import { LanguageMenu } from "./LanguageMenu";
import { LoginOperator } from "./LoginOperator";

interface IHeaderProps {
  auth?: IAuth;
}

export const Header = ({ auth }: IHeaderProps) => {
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
          {auth !== undefined && <LoginOperator username={auth.username} /> }
          <LanguageMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
