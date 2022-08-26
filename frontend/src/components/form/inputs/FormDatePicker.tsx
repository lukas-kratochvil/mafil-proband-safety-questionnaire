import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

export const FormDatePicker = ({ name, label, disabled }: IFormDefaultInputProps) => (
  <Controller
    name={name}
    render={({ field }) => (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          {...field}
          label={label}
          inputFormat="dd/MM/yyyy"
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
            />
          )}
          disabled={disabled}
        />
      </LocalizationProvider>
    )}
  />
);
