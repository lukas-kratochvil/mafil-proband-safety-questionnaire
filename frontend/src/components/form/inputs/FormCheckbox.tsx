import { Checkbox, FormControlLabel } from "@mui/material";
import { Controller } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

export const FormCheckbox = ({ name, label, disabled }: IFormDefaultInputProps) => (
  <Controller
    name={name}
    render={({ field }) => (
      <FormControlLabel
        label={label}
        labelPlacement="start"
        value="start"
        control={<Checkbox {...field} />}
        disabled={disabled}
        sx={{ height: "100%" }}
      />
    )}
  />
);
