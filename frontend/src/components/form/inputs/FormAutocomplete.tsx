import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

interface IFormAutocompleteProps extends IFormDefaultInputProps {
  options: string[];
  defaultValue?: string;
}

export const FormAutocomplete = ({ name, label, disabled, options, defaultValue }: IFormAutocompleteProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      defaultValue={defaultValue ?? ""}
      control={control}
      render={({ field: { ref, onChange, ...rest } }) => (
        <Autocomplete
          options={options}
          onChange={(_, value) => onChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              {...rest}
              label={label}
              inputRef={ref}
              fullWidth
            />
          )}
          disabled={disabled}
        />
      )}
    />
  );
};
