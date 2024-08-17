import { Stack } from "@mui/material";
import type { PropsWithChildren } from "react";
import { useAuth } from "@app/hooks/auth/auth";

type PageContainerProps = {
  center?: boolean;
  isTablePage?: boolean;
};

export const PageContainer = ({ children, center, isTablePage }: PropsWithChildren<PageContainerProps>) => {
  const { operator } = useAuth();

  return (
    <Stack
      spacing="1.5rem"
      paddingX="1rem"
      sx={{
        // content height is minus 4rem header and minus 3rem navigation (if viewed in the auth version).. added both sizes 2x so that the content is centered
        height: center ? `calc(100vh - 8rem ${operator === undefined ? "" : "- 6rem"})` : undefined,
        width: "100%",
        maxWidth: ({ breakpoints }) => (isTablePage ? "95%" : breakpoints.values.md),
        marginX: "auto",
        marginY: center ? "auto" : "2rem",
        justifyContent: center ? "center" : undefined,
        alignItems: center ? "center" : undefined,
      }}
    >
      {children}
    </Stack>
  );
};
