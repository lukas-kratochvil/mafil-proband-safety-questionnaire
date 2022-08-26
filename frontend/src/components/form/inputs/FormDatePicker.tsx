import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller, useFormContext } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

interface IFormDatePickerProps extends IFormDefaultInputProps {
  defaultValue?: Date;
}

export const FormDatePicker = ({ name, label, disabled, defaultValue }: IFormDatePickerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? null}
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
};
