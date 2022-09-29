import { Grid, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface IFormLabelFieldProps {
  label: string;
}

export const FormLabelField = ({ children, label }: PropsWithChildren<IFormLabelFieldProps>) => (
  <>
    <Grid
      container
      direction="row"
      wrap="nowrap"
      paddingRight="3rem"
    >
      <Typography
        noWrap
        width="fit-content"
      >
        {label}
      </Typography>
      <Typography width="fit-content">:</Typography>
    </Grid>
    {children}
  </>
);
