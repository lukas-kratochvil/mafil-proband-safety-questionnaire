import { InputAdornment, TextField } from "@mui/material";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

interface IFormTextFieldProps extends IFormDefaultInputProps {
  endAdornmentLabel?: ReactNode;
}

export const FormTextField = ({ label, defaultValue, endAdornmentLabel, disabled }: IFormTextFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={label}
      control={control}
      defaultValue={defaultValue ?? ""}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          variant="outlined"
          fullWidth
          disabled={disabled}
          InputProps={{
            endAdornment: <InputAdornment position="end">{endAdornmentLabel}</InputAdornment>,
          }}
        />
      )}
    />
  );
};
