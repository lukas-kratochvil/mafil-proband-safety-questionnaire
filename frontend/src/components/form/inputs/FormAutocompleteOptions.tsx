import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { convertStringToLocalizationKey, defaultNS } from "@app/i18n/i18n";
import type { IOption } from "../util/options";
import { FormAutocompleteInputField } from "./FormAutocompleteInputField";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import type { IFormDefaultInputProps } from "./input-props";

type IFormAutocompleteOptionsProps<T> = IFormDefaultInputProps & {
  options: IOption<T>[];
};

export const FormAutocompleteOptions = <T,>({
  name,
  label,
  isOptional,
  disabled,
  options,
}: IFormAutocompleteOptionsProps<T>) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form" });
  const isLoading = options.length === 0;

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
            getOptionLabel={(option: IOption<T>) =>
              t(convertStringToLocalizationKey(`enums.${option.localizationKey}`))
            }
            isOptionEqualToValue={(option, value) => option.value === value.value}
            value={field.value}
            onChange={(_event, val) => field.onChange(val)}
            onBlur={field.onBlur}
            disabled={disabled}
            loading={isLoading}
            loadingText={`${t("common.loading")}…`}
            noOptionsText={t("common.noOptions")}
            renderInput={(params) => (
              <FormAutocompleteInputField
                name={name}
                isLoading={isLoading}
                field={field}
                params={params}
              />
            )}
          />
        )}
      />
    </FormInputFieldContainer>
  );
};
