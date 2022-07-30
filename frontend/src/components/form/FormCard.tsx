import { Card, Divider, Grid, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface IFormCardProps {
  title?: string;
  mainGridPadding?: number;
}

export const FormCard = ({
  children,
  title,
  mainGridPadding = 2,
}: PropsWithChildren<IFormCardProps>) => (
  <Card
    sx={{
      border: 2,
    }}
  >
    {title && (
      <>
        <Typography
          textAlign="center"
          fontWeight="bold"
          fontSize={20}
          paddingY={1}
        >
          {title}
        </Typography>
        <Divider flexItem />
      </>
    )}
    <Grid
      container
      sx={{
        padding: mainGridPadding,
      }}
    >
      {children}
    </Grid>
  </Card>
);
