import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n/i18n";
import { INativeLanguage } from "@app/model/language";
import { compareNativeLanguages, filterNativeLanguages } from "../util/utils";
import { FormAutocompleteInputField } from "./FormAutocompleteInputField";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import { IFormAsyncAutocompleteProps } from "./interfaces/input-props";

export const FormAutocompleteNativeLanguages = ({
  name,
  label,
  isOptional,
  disabled,
  options,
  isLoading,
}: IFormAsyncAutocompleteProps<INativeLanguage>) => {
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
            getOptionLabel={(option: INativeLanguage) => option.nativeName}
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
