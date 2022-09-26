import { Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

interface IFormAutocompleteProps extends IFormDefaultInputProps {
  options: string[];
}

export const FormAutocomplete = ({ name, label, disabled, options }: IFormAutocompleteProps) => (
  <Controller
    name={name}
    render={({ field }) => (
      <Autocomplete
        options={options}
        value={field.value}
        onChange={(_, val) => field.onChange(val)}
        onBlur={field.onBlur}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            inputRef={field.ref}
            name={field.name}
          />
        )}
      />
    )}
  />
);
