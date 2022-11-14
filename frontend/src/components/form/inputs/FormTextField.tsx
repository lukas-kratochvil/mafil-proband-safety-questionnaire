import { InputAdornment, TextField, Theme, useMediaQuery } from "@mui/material";
import { HTMLInputTypeAttribute, ReactNode } from "react";
import { Controller } from "react-hook-form";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import { IFormDefaultInputProps } from "./interfaces/input-props";

interface IFormTextFieldProps extends IFormDefaultInputProps {
  type?: HTMLInputTypeAttribute;
  isSmall?: boolean;
  isMultiline?: boolean;
  endAdornmentLabel?: ReactNode;
}

export const FormTextField = ({
  name,
  label,
  isOptional,
  disabled,
  type,
  isSmall,
  isMultiline,
  endAdornmentLabel,
}: IFormTextFieldProps) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <FormInputFieldContainer
      label={label}
      name={name}
      isOptional={isOptional}
    >
      <Controller
        name={name}
        render={({ field: { ref, ...rest } }) => (
          <TextField
            {...rest}
            id={name}
            inputRef={ref}
            disabled={disabled}
            type={type ?? "text"}
            size={isSmall || matchesDownSmBreakpoint ? "small" : "medium"}
            multiline={isMultiline}
            InputProps={{
              endAdornment: <InputAdornment position="end">{endAdornmentLabel}</InputAdornment>,
            }}
          />
        )}
      />
    </FormInputFieldContainer>
  );
};
