import { Autocomplete, type FilterOptionsState } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormAutocompleteInputField } from "./FormAutocompleteInputField";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import type { FormAsyncAutocompleteProps } from "./input-props";

type FormAutocompleteProps<T> = FormAsyncAutocompleteProps<T> & {
  sortComparator?: (a: T, b: T) => number;
  filterOptions?: (options: T[], state: FilterOptionsState<T>) => T[];
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue: (option: T, value: T) => boolean;
};

const getOptions = <T,>(
  options: FormAutocompleteProps<T>["options"],
  sortComparator: FormAutocompleteProps<T>["sortComparator"]
): NonNullable<FormAutocompleteProps<T>["options"]> => {
  if (options === undefined) {
    return [];
  }
  return sortComparator === undefined ? options : options.toSorted(sortComparator);
};

export const FormAutocomplete = <T,>({
  name,
  label,
  isOptional,
  options,
  isLoading,
  disabled,
  sortComparator,
  filterOptions,
  getOptionLabel,
  isOptionEqualToValue,
}: FormAutocompleteProps<T>) => {
  const { t } = useTranslation("translation", { keyPrefix: "form.common" });

  return (
    <FormInputFieldContainer
      label={label}
      name={name}
      isOptional={isOptional}
    >
      <Controller
        name={name}
        render={({ field }) => (
          <Autocomplete<T>
            id={name}
            options={getOptions(options, sortComparator)}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            filterOptions={filterOptions}
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
