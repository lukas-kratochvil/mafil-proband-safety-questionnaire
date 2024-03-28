import { InputAdornment, TextField, useMediaQuery, type Theme } from "@mui/material";
import type { HTMLInputTypeAttribute, ReactNode } from "react";
import { Controller } from "react-hook-form";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import type { FormDefaultInputProps } from "./input-props";

type FormTextFieldProps = FormDefaultInputProps & {
  type?: HTMLInputTypeAttribute;
  isSmall?: boolean;
  isMultiline?: boolean;
  hasAutocomplete?: boolean;
  endAdornmentLabel?: ReactNode;
  hasAutoFocus?: boolean;
};

export const FormTextField = ({
  name,
  label,
  isOptional,
  disabled,
  type,
  isSmall,
  isMultiline,
  hasAutocomplete,
  endAdornmentLabel,
  hasAutoFocus,
}: FormTextFieldProps) => {
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
            autoComplete={hasAutocomplete ? "on" : "off"}
            autoFocus={hasAutoFocus}
            InputProps={{
              endAdornment: <InputAdornment position="end">{endAdornmentLabel}</InputAdornment>,
            }}
            inputProps={{
              "aria-label": name,
            }}
          />
        )}
      />
    </FormInputFieldContainer>
  );
};
