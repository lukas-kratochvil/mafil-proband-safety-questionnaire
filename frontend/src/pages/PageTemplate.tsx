import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import { Header } from "../components/header/Header";
import { Navigation } from "../components/navigation/Navigation";
import { useAuth } from "../hooks/auth/Auth";

interface IPageTemplateProps {
  centerize?: boolean;
  isTabPage?: boolean;
}

export const PageTemplate = ({ children, centerize, isTabPage }: PropsWithChildren<IPageTemplateProps>) => {
  const { username } = useAuth();

  return (
    <>
      <Header />
      {username !== undefined && <Navigation />}
      <Stack
        spacing={3}
        sx={{
          marginX: isTabPage ? "10%" : "20rem",
          marginY: centerize ? undefined : "3rem",
          justifyContent: centerize ? "center" : undefined,
          alignItems: centerize ? "center" : undefined,
          height: centerize ? `calc(100vh - 64px ${username === undefined ? "" : "- 3rem"})` : undefined, // 64px header, 3rem navigation
        }}
      >
        {children}
      </Stack>
    </>
  );
};
