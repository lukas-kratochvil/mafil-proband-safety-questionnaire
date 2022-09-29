import { Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormLabelField } from "./FormLabelField";
import { IFormDefaultInputProps } from "./form_input";

interface IFormAutocompleteProps extends IFormDefaultInputProps {
  options: string[];
}

export const FormAutocomplete = ({ name, label, disabled, options }: IFormAutocompleteProps) => (
  <FormLabelField label={label}>
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
              inputRef={field.ref}
              name={field.name}
            />
          )}
        />
      )}
    />
  </FormLabelField>
);
