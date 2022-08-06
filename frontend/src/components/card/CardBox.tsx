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
      paddingY="0.5rem"
    >
      {title}
    </Typography>
    <Divider flexItem />
    {children}
  </Card>
);
