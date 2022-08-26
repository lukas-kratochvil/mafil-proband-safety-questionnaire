import { Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

interface IFormAutocompleteProps extends IFormDefaultInputProps {
  options: string[];
}

export const FormAutocomplete = ({ name, label, disabled, options }: IFormAutocompleteProps) => (
  <Controller
    name={name}
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
