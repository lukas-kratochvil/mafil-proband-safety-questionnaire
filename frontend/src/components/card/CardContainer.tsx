import { Card, Divider, Typography, useTheme } from "@mui/material";
import { lime } from "@mui/material/colors";
import { PropsWithChildren } from "react";

interface ICardContainerProps {
  title: string;
}

export const CardContainer = ({ children, title }: PropsWithChildren<ICardContainerProps>) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        border: 1,
        borderColor: theme.palette.grey[600],
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
};
