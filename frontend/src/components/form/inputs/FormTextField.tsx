import { InputAdornment, TextField } from "@mui/material";
import { ReactNode } from "react";

interface IFormTextFieldProps {
  label: string;
  endAdornmentLabel?: ReactNode;
  disabled?: boolean;
}

export const FormTextField = ({ label, endAdornmentLabel, disabled }: IFormTextFieldProps) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      disabled={disabled}
      InputProps={{
        endAdornment: <InputAdornment position="end">
          {endAdornmentLabel}
        </InputAdornment>
      }}
      sx={{
        minWidth: '100%',
      }} />
  );
};
