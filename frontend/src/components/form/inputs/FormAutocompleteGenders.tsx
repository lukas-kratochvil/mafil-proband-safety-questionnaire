import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { IGenderDTO } from "@app/util/server_API/dto";
import { compareGenders } from "../util/utils";
import { FormAutocompleteInputField } from "./FormAutocompleteInputField";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import { IFormAsyncAutocompleteProps } from "./interfaces/input-props";

export const FormAutocompleteGenders = ({
  name,
  label,
  isOptional,
  disabled,
  options,
  isLoading,
}: IFormAsyncAutocompleteProps<IGenderDTO>) => {
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
            options={options?.sort((a, b) => compareGenders(a, b)) ?? []}
            getOptionLabel={(option: IGenderDTO) =>
              option.translations.find((trans) => trans.language.code === i18n.language)?.text ?? ""
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={field.value as IGenderDTO}
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
