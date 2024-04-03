import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n/i18n";
import type { AutocompleteOption } from "../util/options";
import { FormAutocomplete } from "./FormAutocomplete";
import type { FormDefaultInputProps } from "./input-props";

type FormAutocompleteOptionsProps<T> = FormDefaultInputProps & {
  options: AutocompleteOption<T>[];
};

export const FormAutocompleteOptions = <T,>({
  name,
  label,
  isOptional,
  disabled,
  options,
}: FormAutocompleteOptionsProps<T>) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form" });
  const isLoading = options.length === 0;

  return (
    <FormAutocomplete<AutocompleteOption<T>>
      label={label}
      name={name}
      isOptional={isOptional}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      getOptionLabel={(option) => t(option.localizationKey)}
      isOptionEqualToValue={(option, value) => option.value === value.value}
    />
  );
};
