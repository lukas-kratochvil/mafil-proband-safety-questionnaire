import { Box } from "@mui/material";

interface IBoldTextSpanProps {
  text: string;
}

export const BoldTextSpan = ({ text }: IBoldTextSpanProps) => (
  <Box
    component="span"
    fontWeight={500}
  >
    {text}
  </Box>
);
