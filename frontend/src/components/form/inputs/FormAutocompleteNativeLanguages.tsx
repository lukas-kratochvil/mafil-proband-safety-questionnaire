import { Autocomplete, type FilterOptionsState } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n/i18n";
import type { NativeLanguage } from "@app/model/language";
import { FormAutocompleteInputField } from "./FormAutocompleteInputField";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import type { FormAsyncAutocompleteProps } from "./input-props";

const compareNativeLanguages = (a: NativeLanguage, b: NativeLanguage): number => {
  if (a.priority && b.priority) {
    return a.priority - b.priority;
  }
  if (a.priority) {
    return -1;
  }
  if (b.priority) {
    return 1;
  }
  return a.nameEn.localeCompare(b.nameEn);
};

const filterNativeLanguages = (options: NativeLanguage[], state: FilterOptionsState<NativeLanguage>) => {
  const inputValue = state.inputValue.trim().toLowerCase();
  return options.filter((option) => {
    const valuesToBeMatched = [option.nativeName, option.nameCs, option.nameEn];
    return valuesToBeMatched.some((optionValue) => optionValue.trim().toLowerCase().startsWith(inputValue));
  });
};

export const FormAutocompleteNativeLanguages = ({
  name,
  label,
  isOptional,
  disabled,
  options,
  isLoading,
}: FormAsyncAutocompleteProps<NativeLanguage>) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.common" });

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
            options={options?.sort(compareNativeLanguages) ?? []}
            getOptionLabel={(option: NativeLanguage) => option.nativeName}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            filterOptions={filterNativeLanguages}
            value={field.value}
            onChange={(_event, val) => field.onChange(val)}
            onBlur={field.onBlur}
            disabled={disabled}
            loading={isLoading}
            loadingText={`${t("loading")}…`}
            noOptionsText={t("noOptions")}
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
