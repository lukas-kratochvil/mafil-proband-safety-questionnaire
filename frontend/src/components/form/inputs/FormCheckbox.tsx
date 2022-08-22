import { Checkbox, FormControlLabel } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface IFormCheckboxProps {
  label: string;
  defaultValue?: boolean;
  disabled?: boolean;
}

export const FormCheckbox = ({ label, defaultValue, disabled }: IFormCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      label={label}
      labelPlacement="start"
      value="start"
      control={
        <Controller
          name={label}
          control={control}
          defaultValue={defaultValue ?? false}
          render={({ field }) => <Checkbox {...field} />}
        />
      }
      disabled={disabled}
      sx={{
        height: "100%",
      }}
    />
  );
};
