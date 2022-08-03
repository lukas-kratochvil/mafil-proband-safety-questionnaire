import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import { IAuth } from "../App";
import { Header } from "../components/header/Header";
import { Navigation } from "../components/navigation/Navigation";

interface IPageTemplateProps {
  auth?: IAuth;
  centerize?: boolean;
  isTabPage?: boolean;
}

export const PageTemplate = ({ children, auth, centerize, isTabPage }: PropsWithChildren<IPageTemplateProps>) => (
  <>
    <Header auth={auth} />
    {auth !== undefined && <Navigation />}
    <Stack
      spacing={3}
      sx={{
        marginX: isTabPage ? "10%" : "20rem",
        marginY: centerize ? undefined : "3rem",
        justifyContent: centerize ? "center" : undefined,
        alignItems: centerize ? "center" : undefined,
        height: centerize ? `calc(100vh - 64px ${auth === undefined ? "" : "- 50px"})` : undefined, // 64px header, 50px navigation
      }}
    >
      {children}
    </Stack>
  </>
);
