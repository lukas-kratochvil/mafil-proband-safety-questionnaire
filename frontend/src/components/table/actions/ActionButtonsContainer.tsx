import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export interface IActionButtonsProps {
  visitId: string;
}

export const ActionButtonsContainer = ({ children }: PropsWithChildren) => (
  <Box
    sx={{
      display: "flex",
      gap: "1rem",
    }}
  >
    {children}
  </Box>
);
