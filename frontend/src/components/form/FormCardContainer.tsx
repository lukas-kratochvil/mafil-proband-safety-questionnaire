import { Grid } from "@mui/material";
import { PropsWithChildren } from "react";
import { CardContainer } from "../card/CardContainer";

interface IFormCardContainerProps {
  title: string;
  mainGridPadding?: number;
}

export const FormCardContainer = ({
  children,
  title,
  mainGridPadding = 2,
}: PropsWithChildren<IFormCardContainerProps>) => (
  <CardContainer title={title}>
    <Grid
      container
      sx={{ padding: mainGridPadding }}
    >
      {children}
    </Grid>
  </CardContainer>
);
