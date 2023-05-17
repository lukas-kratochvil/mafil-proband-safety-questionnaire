import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "@app/components/header/Header";
import { useAuth } from "@app/hooks/auth/AuthProvider";

interface IPageContainerProps {
  center?: boolean;
  isTablePage?: boolean;
}

export const PageContainer = ({ children, center, isTablePage }: PropsWithChildren<IPageContainerProps>) => {
  const { operator } = useAuth();

  return (
    <>
      <Header />
      <Toaster />
      <main>
        <Stack
          spacing="1.5rem"
          sx={{
            // content height is minus 4rem header and minus 3rem navigation (if viewed in the auth version).. added both sizes 2x so that the content is centered
            height: center ? `calc(100vh - 8rem ${operator === undefined ? "" : "- 6rem"})` : undefined,
            width: "100%",
            maxWidth: ({ breakpoints }) => (isTablePage ? "95%" : breakpoints.values.md),
            marginX: "auto",
            marginY: "2rem",
            justifyContent: center ? "center" : undefined,
            alignItems: center ? "center" : undefined,
          }}
        >
          {children}
        </Stack>
      </main>
    </>
  );
};
