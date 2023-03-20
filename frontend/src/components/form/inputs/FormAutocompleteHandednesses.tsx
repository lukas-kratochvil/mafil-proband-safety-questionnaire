import { Autocomplete, CircularProgress, TextField, Theme, useMediaQuery } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { IHandednessDTO } from "@app/util/server_API/dto";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import { IFormDefaultInputProps } from "./interfaces/input-props";

interface IFormAutocompleteHandednessesProps extends IFormDefaultInputProps {
  options: IHandednessDTO[] | undefined;
  compareFnc: (a: IHandednessDTO, b: IHandednessDTO, locale: string) => number;
  isLoading: boolean;
}

export const FormAutocompleteHandednesses = ({
  name,
  label,
  isOptional,
  disabled,
  options,
  compareFnc,
  isLoading,
}: IFormAutocompleteHandednessesProps) => {
  const { i18n, t } = useTranslation(defaultNS, { keyPrefix: "form.common" });
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

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
            options={options?.sort((a, b) => compareFnc(a, b, i18n.language)) || []}
            getOptionLabel={(option: IHandednessDTO) =>
              option.translations.find((trans) => trans.language.code === i18n.language)?.text
              || option.translations[0].text
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={field.value as IHandednessDTO}
            onChange={(_event, val) => field.onChange(val)}
            onBlur={field.onBlur}
            disabled={disabled}
            loading={isLoading}
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
                      {isLoading && (
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
