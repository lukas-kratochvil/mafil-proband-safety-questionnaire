import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

interface IFormAutocompleteProps extends IFormDefaultInputProps {
  options: string[];
}

export const FormAutocomplete = ({ name, label, disabled, options }: IFormAutocompleteProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <Autocomplete
          options={options}
          value={value}
          onChange={(_, val) => onChange(val)}
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              fullWidth
            />
          )}
        />
      )}
    />
  );
};
