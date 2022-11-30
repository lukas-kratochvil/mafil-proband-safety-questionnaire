import { Autocomplete, CircularProgress, TextField, Theme, useMediaQuery } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@i18n";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import { IFormDefaultInputProps } from "./interfaces/input-props";

interface IFormAutocompleteProps extends IFormDefaultInputProps {
  options: string[];
}

export const FormAutocomplete = ({ name, label, isOptional, disabled, options }: IFormAutocompleteProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.common" });
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
            id={name}
            options={options}
            value={field.value}
            onChange={(_event, val) => field.onChange(val)}
            onBlur={field.onBlur}
            disabled={disabled}
            loading={loading}
            loadingText={`${t("loading")}…`}
            noOptionsText={t("noOptions")}
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
                inputProps={{
                  ...params.inputProps,
                  "aria-label": name,
                }}
              />
            )}
          />
        )}
      />
    </FormInputFieldContainer>
  );
};
