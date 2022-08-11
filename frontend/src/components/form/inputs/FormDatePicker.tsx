import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller, useFormContext } from "react-hook-form";

interface IFormDatePickerProps {
  label: string;
  disabled?: boolean;
}

export const FormDatePicker = ({ label, disabled }: IFormDatePickerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={label}
      control={control}
      defaultValue={null}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            {...field}
            label={label}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => <TextField {...params} />}
            disabled={disabled}
          />
        </LocalizationProvider>
      )}
    />
  );
};
