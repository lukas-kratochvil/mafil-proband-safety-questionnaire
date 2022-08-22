import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface IFormAutocompleteProps {
  label: string;
  options: string[];
  defaultValue?: string;
  disabled?: boolean;
}

export const FormAutocomplete = ({ label, options, defaultValue, disabled }: IFormAutocompleteProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={label}
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
