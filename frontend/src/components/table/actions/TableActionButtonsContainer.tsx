import { Box } from "@mui/material";
import type { PropsWithChildren } from "react";

export const TableActionButtonsContainer = ({ children }: PropsWithChildren) => (
  <Box
    sx={{
      display: "flex",
      gap: "1rem",
    }}
  >
    {children}
  </Box>
);
