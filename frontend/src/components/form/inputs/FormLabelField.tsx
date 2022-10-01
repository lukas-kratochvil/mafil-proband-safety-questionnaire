import { Grid, Typography, useTheme } from "@mui/material";
import { PropsWithChildren } from "react";

export interface IFormLabelFieldProps {
  label: string;
  isOptional?: boolean;
}

export const FormLabelField = ({ children, label, isOptional }: PropsWithChildren<IFormLabelFieldProps>) => {
  const theme = useTheme();

  return (
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
            color={theme.palette.text.secondary}
          >
            (nepovinné)
          </Typography>
        )}
      </Grid>
      {children}
    </>
  );
};
