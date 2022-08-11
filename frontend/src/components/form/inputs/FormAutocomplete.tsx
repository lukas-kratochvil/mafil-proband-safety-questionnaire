import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface IFormAutocompleteProps {
  label: string;
  options: string[];
  disabled?: boolean;
}

export const FormAutocomplete = ({ label, options, disabled }: IFormAutocompleteProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={label}
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
