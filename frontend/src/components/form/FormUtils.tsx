import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";

interface IFormTextFieldProps {
  label: string;
  endAdornmentLabel?: string;
  disabled: boolean;
}

export const FormTextField = ({ label, endAdornmentLabel, disabled }: IFormTextFieldProps) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      disabled={disabled}
      InputProps={{
        endAdornment:
          <InputAdornment position="end">
            {endAdornmentLabel}
          </InputAdornment>
      }}
      sx={{
        minWidth: '100%',
      }}
    />
  );
}

interface IFormAutocompleteProps {
  label: string;
  options: string[];
  disabled: boolean;
}

export const FormAutocomplete = ({ label, options, disabled }: IFormAutocompleteProps) => {
  return (
    <Autocomplete
      options={options}
      renderInput={(params) => <TextField {...params} label={label} />}
      disabled={disabled}
    />
  );
}

interface IFormDatePickerProps {
  label: string;
  disabled: boolean;
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
        disabled={disabled}
      />
    </LocalizationProvider>
  );
}
