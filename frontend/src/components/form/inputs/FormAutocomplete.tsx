import { Autocomplete, CircularProgress, TextField, Theme, useMediaQuery } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import { IFormDefaultInputProps } from "./form_input";

interface IFormAutocompleteProps extends IFormDefaultInputProps {
  options: string[];
}

export const FormAutocomplete = ({ name, label, isOptional, disabled, options }: IFormAutocompleteProps) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const loading = options.length === 0;

  return (
    <FormInputFieldContainer
      label={label}
      name={name}
      isOptional={isOptional}
    >
      <Controller
        name={name}
        render={({ field }) => (
          <Autocomplete
            options={options}
            value={field.value}
            onChange={(_, val) => field.onChange(val)}
            onBlur={field.onBlur}
            disabled={disabled}
            loading={loading}
            loadingText="Načítá se…"
            noOptionsText="Žádné možnosti"
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={field.ref}
                name={field.name}
                size={matchesDownSmBreakpoint ? "small" : "medium"}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading && (
                        <CircularProgress
                          color="inherit"
                          size={20}
                        />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        )}
      />
    </FormInputFieldContainer>
  );
};
