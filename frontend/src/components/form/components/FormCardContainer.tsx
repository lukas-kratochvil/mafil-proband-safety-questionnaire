import { Grid } from "@mui/material";
import { type PropsWithChildren } from "react";
import { CardContainer } from "@app/components/card/CardContainer";

type FormCardContainerProps = {
  title: string;
};

export const FormCardContainer = ({ children, title }: PropsWithChildren<FormCardContainerProps>) => (
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
