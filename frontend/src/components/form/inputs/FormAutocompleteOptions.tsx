import { Autocomplete, CircularProgress, TextField, Theme, useMediaQuery } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { convertStringToLocalizationKey } from "@app/util/utils";
import { IOption } from "../util/options";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import { IFormDefaultInputProps } from "./interfaces/input-props";

interface IFormAutocompleteOptionsProps extends IFormDefaultInputProps {
  options: IOption[];
}

export const FormAutocompleteOptions = ({
  name,
  label,
  isOptional,
  disabled,
  options,
}: IFormAutocompleteOptionsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form" });
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
            getOptionLabel={(option: IOption) => t(convertStringToLocalizationKey(`enums.${option.localizationKey}`))}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            value={field.value}
            onChange={(_event, val) => field.onChange(val)}
            onBlur={field.onBlur}
            disabled={disabled}
            loading={loading}
            loadingText={`${t("common.loading")}…`}
            noOptionsText={t("common.noOptions")}
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
