import { Grid } from "@mui/material";
import { PropsWithChildren } from "react";
import { CardBox } from "../card/CardBox";

interface IFormCardContainerProps {
  title: string;
  mainGridPadding?: number;
}

export const FormCardContainer = ({
  children,
  title,
  mainGridPadding = 2,
}: PropsWithChildren<IFormCardContainerProps>) => (
  <CardBox title={title}>
    <Grid
      container
      sx={{ padding: mainGridPadding }}
    >
      {children}
    </Grid>
  </CardBox>
);
