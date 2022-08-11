import { Checkbox, FormControlLabel } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface IFormCheckboxProps {
  label: string;
  disabled?: boolean;
}

export const FormCheckbox = ({ label, disabled }: IFormCheckboxProps) => {
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
