import { InputAdornment, TextField, useMediaQuery, useTheme } from "@mui/material";
import { HTMLInputTypeAttribute, ReactNode } from "react";
import { Controller } from "react-hook-form";
import { FormLabelFieldContainer } from "./FormLabelFieldContainer";
import { IFormDefaultInputProps } from "./form_input";

interface IFormTextFieldProps extends IFormDefaultInputProps {
  type?: HTMLInputTypeAttribute;
  endAdornmentLabel?: ReactNode;
}

export const FormTextField = ({ name, label, isOptional, disabled, type, endAdornmentLabel }: IFormTextFieldProps) => {
  const theme = useTheme();
  const matchesDownSmBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <FormLabelFieldContainer
      label={label}
      isOptional={isOptional}
    >
      <Controller
        name={name}
        render={({ field: { ref, ...rest } }) => (
          <TextField
            {...rest}
            inputRef={ref}
            disabled={disabled}
            type={type ?? "text"}
            size={matchesDownSmBreakpoint ? "small" : "medium"}
            InputProps={{
              endAdornment: <InputAdornment position="end">{endAdornmentLabel}</InputAdornment>,
            }}
          />
        )}
      />
    </FormLabelFieldContainer>
  );
};
