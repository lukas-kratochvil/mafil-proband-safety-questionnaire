import { Checkbox, FormControlLabel } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

interface IFormCheckboxProps extends IFormDefaultInputProps {
  defaultValue?: boolean;
}

export const FormCheckbox = ({ name, label, disabled, defaultValue }: IFormCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? false}
      render={({ field }) => (
        <FormControlLabel
          label={label}
          labelPlacement="start"
          value="start"
          control={<Checkbox {...field} />}
          disabled={disabled}
          sx={{ height: "100%" }}
        />
      )}
    />
  );
};
