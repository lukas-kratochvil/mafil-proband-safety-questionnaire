import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { INativeLanguageDTO } from "@app/util/server_API/dto";
import { FormAutocompleteInputField } from "./FormAutocompleteInputField";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import { IFormDefaultInputProps } from "./interfaces/input-props";

interface IFormAutocompleteNativeLanguagesProps extends IFormDefaultInputProps {
  options: INativeLanguageDTO[] | undefined;
  compareFnc: (a: INativeLanguageDTO, b: INativeLanguageDTO, locale: string) => number;
  isLoading: boolean;
}

export const FormAutocompleteNativeLanguages = ({
  name,
  label,
  isOptional,
  disabled,
  options,
  compareFnc,
  isLoading,
}: IFormAutocompleteNativeLanguagesProps) => {
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
            options={options?.sort((a, b) => compareFnc(a, b, i18n.language)) || []}
            getOptionLabel={(option: INativeLanguageDTO) =>
              option.translations.find((trans) => trans.language.code === i18n.language)?.text
              || option.translations[0].text
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={field.value as INativeLanguageDTO}
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
