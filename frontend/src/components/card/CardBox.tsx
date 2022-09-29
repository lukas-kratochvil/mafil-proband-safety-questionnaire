import { Card, Divider, Typography, useTheme } from "@mui/material";
import { PropsWithChildren } from "react";

interface ICardBoxProps {
  title: string;
  width?: string;
}

export const CardBox = ({ children, title, width }: PropsWithChildren<ICardBoxProps>) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        border: 1,
        borderColor: theme.palette.grey[600],
        width,
      }}
    >
      <Typography
        textAlign="center"
        fontWeight="bold"
        fontSize="1.25rem"
        paddingY="0.5rem"
        paddingX="1rem"
        bgcolor="#f0f4c3"
      >
        {title}
      </Typography>
      <Divider flexItem />
      {children}
    </Card>
  );
};
