import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";

interface IFormDatePickerProps {
  label: string;
  disabled?: boolean;
}

export const FormDatePicker = ({ label, disabled }: IFormDatePickerProps) => {
  const [date, setDate] = useState<Date | null>(null);

  const handleDateChange = (newValue: Date | null) => setDate(newValue);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={label}
        inputFormat="dd/MM/yyyy"
        value={date}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} />}
        disabled={disabled} />
    </LocalizationProvider>
  );
};
