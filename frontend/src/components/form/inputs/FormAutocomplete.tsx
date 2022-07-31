import { Autocomplete, TextField } from "@mui/material";

interface IFormAutocompleteProps {
  label: string;
  options: string[];
  disabled?: boolean;
}

export const FormAutocomplete = ({ label, options, disabled }: IFormAutocompleteProps) => (
  <Autocomplete
    options={options}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
      />
    )}
    disabled={disabled}
  />
);
