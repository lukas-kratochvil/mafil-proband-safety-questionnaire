import { Grid } from "@mui/material";
import { PropsWithChildren } from "react";
import { CardBox } from "../card/CardBox";

interface IFormCardProps {
  title: string;
  mainGridPadding?: number;
}

export const FormCard = ({ children, title, mainGridPadding = 2 }: PropsWithChildren<IFormCardProps>) => (
  <CardBox title={title}>
    <Grid
      container
      sx={{
        padding: mainGridPadding,
      }}
    >
      {children}
    </Grid>
  </CardBox>
);
