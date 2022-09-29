import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface IFormLabelFieldProps {
  label: string;
}

export const FormLabelField = ({ children, label }: PropsWithChildren<IFormLabelFieldProps>) => (
  <>
    <Typography>{`${label}:`}</Typography>
    {children}
  </>
);
