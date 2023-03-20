import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@app/i18n";
import { IDeviceDTO } from "@app/util/mafildb_API/dto";
import { FormAutocompleteInputField } from "./FormAutocompleteInputField";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import { IFormDefaultInputProps } from "./interfaces/input-props";

interface IFormAutocompleteDevicesProps extends IFormDefaultInputProps {
  options: IDeviceDTO[] | undefined;
  isLoading: boolean;
}

export const FormAutocompleteDevices = ({
  name,
  label,
  isOptional,
  disabled,
  options,
  isLoading,
}: IFormAutocompleteDevicesProps) => {
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
            getOptionLabel={(option: IDeviceDTO) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={field.value as IDeviceDTO}
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
