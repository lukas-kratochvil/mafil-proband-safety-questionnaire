import { InputAdornment, TextField } from "@mui/material";
import { HTMLInputTypeAttribute, ReactNode } from "react";
import { Controller } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

interface IFormTextFieldProps extends IFormDefaultInputProps {
  type?: HTMLInputTypeAttribute;
  endAdornmentLabel?: ReactNode;
}

export const FormTextField = ({ name, label, disabled, type, endAdornmentLabel }: IFormTextFieldProps) => (
  <Controller
    name={name}
    render={({ field: { ref, ...rest } }) => (
      <TextField
        {...rest}
        inputRef={ref}
        label={label}
        disabled={disabled}
        type={type ?? "text"}
        InputProps={{
          endAdornment: <InputAdornment position="end">{endAdornmentLabel}</InputAdornment>,
        }}
      />
    )}
  />
);
