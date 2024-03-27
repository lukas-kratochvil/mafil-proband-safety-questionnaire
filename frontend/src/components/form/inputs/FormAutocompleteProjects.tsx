import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n/i18n";
import type { IProject } from "@app/model/project";
import { FormAutocompleteInputField } from "./FormAutocompleteInputField";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import type { IFormAsyncAutocompleteProps } from "./interfaces/input-props";

const getProjectText = (project: IProject): string => {
  const acronym = project.acronym.trim();
  const name = project.name.trim();
  return name === "" ? acronym : `${acronym} - ${name}`;
};

export const FormAutocompleteProjects = ({
  name,
  label,
  isOptional,
  disabled,
  options,
  isLoading,
}: IFormAsyncAutocompleteProps<IProject>) => {
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
            options={options === undefined ? [] : options}
            getOptionLabel={getProjectText}
            isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
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
