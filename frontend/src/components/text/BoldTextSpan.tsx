import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export const BoldTextSpan = ({ children }: PropsWithChildren) => (
  <Box
    component="span"
    fontWeight={500}
  >
    {children}
  </Box>
);
