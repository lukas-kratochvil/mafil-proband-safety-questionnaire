import { Grid, Typography } from "@mui/material";
import { PropsWithChildren } from "react";
import { ErrorFeedback } from "../ErrorFeedback";

export interface IFormInputFieldContainerProps {
  label: string;
  name: string;
  isOptional?: boolean;
}

export const FormInputFieldContainer = ({
  children,
  label,
  name,
  isOptional,
}: PropsWithChildren<IFormInputFieldContainerProps>) => (
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
    <ErrorFeedback name={name} />
  </>
);
