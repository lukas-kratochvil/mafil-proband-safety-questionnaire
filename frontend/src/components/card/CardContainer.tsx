import { Card, Divider, Typography } from "@mui/material";
import { lime } from "@mui/material/colors";
import { PropsWithChildren } from "react";

interface ICardContainerProps {
  title: string;
  maxWidth?: string;
}

export const CardContainer = ({ children, title, maxWidth }: PropsWithChildren<ICardContainerProps>) => (
  <Card
    sx={{
      width: "100%",
      maxWidth,
      border: 1,
      borderColor: ({ palette }) => palette.grey[600],
    }}
  >
    <Typography
      textAlign="center"
      fontWeight="bold"
      fontSize="1.25rem"
      paddingY="0.5rem"
      paddingX="1rem"
      bgcolor={lime[100]}
    >
      {title}
    </Typography>
    <Divider flexItem />
    {children}
  </Card>
);
