import { Card, Divider, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface ICardBoxProps {
  width?: string;
  title: string;
}

export const CardBox = ({ children, width = undefined, title }: PropsWithChildren<ICardBoxProps>) => (
  <Card
    sx={{
      border: 2,
      width,
    }}
  >
    <Typography
      textAlign="center"
      fontWeight="bold"
      fontSize="1.25rem"
      padding="0.5rem"
      bgcolor="#f0f4c3"
    >
      {title}
    </Typography>
    <Divider flexItem />
    {children}
  </Card>
);
