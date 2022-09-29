import { Stack, useTheme } from "@mui/material";
import { PropsWithChildren } from "react";
import { Header } from "../components/header/Header";
import { useAuth } from "../hooks/auth/Auth";

interface IPageTemplateProps {
  centerize?: boolean;
  isTablePage?: boolean;
}

export const PageTemplate = ({ children, centerize, isTablePage }: PropsWithChildren<IPageTemplateProps>) => {
  const { username } = useAuth();
  const theme = useTheme();

  return (
    <>
      <Header />
      <main>
        <Stack
          spacing={3}
          sx={{
            // content height is minus 4rem header and minus 3rem navigation (if viewed in the auth version)
            height: centerize ? `calc(100vh - 4rem ${username === undefined ? "" : "- 3rem"})` : undefined,
            width: "100%",
            maxWidth: isTablePage ? "95%" : theme.breakpoints.values.md,
            marginX: "auto",
            marginY: centerize ? "auto" : "2rem",
            justifyContent: centerize ? "center" : undefined,
            alignItems: centerize ? "center" : undefined,
          }}
        >
          {children}
        </Stack>
      </main>
    </>
  );
};
