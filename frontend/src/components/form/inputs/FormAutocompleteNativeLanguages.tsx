import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n/i18n";
import { INativeLanguageDTO } from "@app/util/server_API/dto";
import { compareNativeLanguages } from "../util/utils";
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
}: IFormAsyncAutocompleteProps<INativeLanguageDTO>) => {
  const { i18n, t } = useTranslation(defaultNS, { keyPrefix: "form.common" });

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
            options={options?.sort((a, b) => compareNativeLanguages(a, b, i18n.language)) ?? []}
            getOptionLabel={(option: INativeLanguageDTO) =>
              option.translations.find((trans) => trans.language.code === i18n.language)?.text ?? ""
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
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
