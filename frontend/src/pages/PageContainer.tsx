import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import { Header } from "@app/components/header/Header";
import { useAuth } from "@app/hooks/auth/auth";

interface IPageContainerProps {
  centerize?: boolean;
  isTablePage?: boolean;
}

export const PageContainer = ({ children, centerize, isTablePage }: PropsWithChildren<IPageContainerProps>) => {
  const { operator } = useAuth();

  return (
    <>
      <Header />
      <main>
        <Stack
          spacing="1.5rem"
          sx={{
            // content height is minus 4rem header and minus 3rem navigation (if viewed in the auth version).. added both sizes 2x so that the content is centered
            height: centerize ? `calc(100vh - 8rem ${operator === undefined ? "" : "- 6rem"})` : undefined,
            width: "100%",
            maxWidth: ({ breakpoints }) => (isTablePage ? "95%" : breakpoints.values.md),
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
