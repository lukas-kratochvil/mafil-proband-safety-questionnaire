import { useMediaQuery, type Theme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { cs, enUS, type Locale } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInputFieldContainer } from "./FormInputFieldContainer";
import type { FormDefaultInputProps } from "./input-props";

type FormDatePickerProps = FormDefaultInputProps & {
  maxDate?: Date;
};

export const FormDatePicker = ({ name, label, isOptional, disabled, maxDate }: FormDatePickerProps) => {
  const matchesDownSmBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState<Locale>();

  useEffect(() => {
    setLocale(i18n.language === "cs" ? cs : enUS);
  }, [i18n.language]);

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
            adapterLocale={locale}
          >
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              inputRef={field.ref}
              format="dd.MM.yyyy"
              maxDate={maxDate}
              slotProps={{
                textField: {
                  id: name,
                  onBlur: field.onBlur,
                  name: field.name,
                  size: matchesDownSmBreakpoint ? "small" : "medium",
                  autoComplete: "off",
                  inputProps: { "aria-label": name },
                },
              }}
              disabled={disabled}
            />
          </LocalizationProvider>
        )}
      />
    </FormInputFieldContainer>
  );
};
