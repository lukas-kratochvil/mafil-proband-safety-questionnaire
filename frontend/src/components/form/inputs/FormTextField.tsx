import { InputAdornment, TextField } from "@mui/material";
import { ReactNode } from "react";
import { Controller } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

interface IFormTextFieldProps extends IFormDefaultInputProps {
  endAdornmentLabel?: ReactNode;
}

export const FormTextField = ({ name, label, disabled, endAdornmentLabel }: IFormTextFieldProps) => (
  <Controller
    name={name}
    render={({ field: { value, onChange, ref } }) => (
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        inputRef={ref}
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
