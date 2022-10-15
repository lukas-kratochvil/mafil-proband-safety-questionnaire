import { Grid, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

export interface IFormLabelFieldContainerProps {
  label: string;
  isOptional?: boolean;
}

export const FormLabelFieldContainer = ({
  children,
  label,
  isOptional,
}: PropsWithChildren<IFormLabelFieldContainerProps>) => (
  <>
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography>{label}</Typography>
      {isOptional && (
        <Typography
          fontSize="0.85rem"
          color={({ palette }) => palette.text.secondary}
        >
          (nepovinné)
        </Typography>
      )}
    </Grid>
    {children}
  </>
);
