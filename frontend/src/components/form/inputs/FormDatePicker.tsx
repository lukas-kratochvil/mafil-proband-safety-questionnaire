import { TextField, Theme, useMediaQuery } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CsLocale from "date-fns/locale/cs";
import { Controller } from "react-hook-form";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import { IFormDefaultInputProps } from "./interfaces/input-props";

interface IFormDatePicker extends IFormDefaultInputProps {
  maxDate?: Date;
}

export const FormDatePicker = ({ name, label, isOptional, disabled, maxDate }: IFormDatePicker) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <FormInputFieldContainer
      label={label}
      name={name}
      isOptional={isOptional}
    >
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
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
              inputFormat="dd.MM.yyyy"
              maxDate={maxDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id={name}
                  onBlur={field.onBlur}
                  name={field.name}
                  size={matchesDownSmBreakpoint ? "small" : "medium"}
                  autoComplete="off"
                  inputProps={{
                    ...params.inputProps,
                    "aria-label": name,
                  }}
                />
              )}
              disabled={disabled}
            />
          </LocalizationProvider>
        )}
      />
    </FormInputFieldContainer>
  );
};
