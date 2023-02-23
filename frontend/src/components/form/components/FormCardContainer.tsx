import { Grid } from "@mui/material";
import { PropsWithChildren } from "react";
import { CardContainer } from "@app/components/card/CardContainer";

interface IFormCardContainerProps {
  title: string;
}

export const FormCardContainer = ({ children, title }: PropsWithChildren<IFormCardContainerProps>) => (
  <CardContainer title={title}>
    <Grid
      container
      sx={{
        padding: 2,
        textAlign: "justify",
      }}
    >
      {children}
    </Grid>
  </CardContainer>
);
