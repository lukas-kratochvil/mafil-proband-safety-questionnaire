import { InputAdornment, TextField } from "@mui/material";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface IFormTextFieldProps {
  label: string;
  endAdornmentLabel?: ReactNode;
  disabled?: boolean;
}

export const FormTextField = ({ label, endAdornmentLabel, disabled }: IFormTextFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={label}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          variant="outlined"
          disabled={disabled}
          InputProps={{
            endAdornment: <InputAdornment position="end">{endAdornmentLabel}</InputAdornment>,
          }}
          sx={{
            minWidth: "100%",
          }}
        />
      )}
    />
  );
};
