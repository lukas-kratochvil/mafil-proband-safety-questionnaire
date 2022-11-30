import { Grid } from "@mui/material";
import { PropsWithChildren } from "react";
import { CardContainer } from "@components/card/CardContainer";

interface IFormCardContainerProps {
  title: string;
}

export const FormCardContainer = ({ children, title }: PropsWithChildren<IFormCardContainerProps>) => (
  <CardContainer title={title}>
    <Grid
      container
      sx={{ padding: 2 }}
    >
      {children}
    </Grid>
  </CardContainer>
);
