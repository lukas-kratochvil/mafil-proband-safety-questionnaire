import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CsLocale from "date-fns/locale/cs";
import { Controller } from "react-hook-form";
import { IFormDefaultInputProps } from "./form_input";

export const FormDatePicker = ({ name, label, disabled }: IFormDefaultInputProps) => (
  <Controller
    name={name}
    render={({ field }) => (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        /**
         * TODO:
         *  - change when different language is chosen
         *  - find 'Answer : 6' on this page https://www.anycodings.com/2022/01/reactjs-material-ui-how-to-use.html and create similar language mapping
         */
        adapterLocale={CsLocale}
      >
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
