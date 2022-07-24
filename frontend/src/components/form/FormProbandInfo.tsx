import { Autocomplete, Divider, Grid, InputAdornment, Stack, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { genders, nativeLanguages, sideDominance, visualCorrection } from "./data";
import { FormCard } from "./FormCard";

interface IFormTextFieldProps {
  label: string;
  endAdornment?: React.ReactNode;
}

const FormTextField = ({ label, endAdornment }: IFormTextFieldProps) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      InputProps={{
        endAdornment: endAdornment
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
}

const FormAutocomplete = ({ label, options }: IFormAutocompleteProps) => {
  return (
    <Autocomplete
      options={options}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}

// TODO: use only Autocomplete or Select either? OnChange event on this select component does not work!
/*
interface IFormSelectProps {
  label: string;
  options: string[];
}

const FormSelect = ({ label, options }: IFormSelectProps) => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => setValue(event.target.value as string);

  return (
    <FormControl fullWidth>
      <InputLabel id={`select-${label}`}>
        {label}
      </InputLabel>
      <Select
        labelId={`select-${label}`}
        id="demo-simple-select"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map((option, index) =>
          <MenuItem key={index}>
            {option}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}
*/

export const FormProbandInfo = () => {
  const [birthdate, setBirthdate] = useState<Date | null>(null);

  const handleBirthdateChange = (newValue: Date | null) => setBirthdate(newValue);

  return (
    <FormCard title={'Osobní údaje'}>
      <Stack
        spacing={1}
        minWidth="100%"
      >
        <Grid
          container
          direction="row"
          spacing={2}
          columns={4}
        >
          {/* 1. row */}
          <Grid item xs={2}>
            <FormTextField label="Jméno" />
          </Grid>
          <Grid item xs={2}>
            <FormTextField label="Příjmení" />
          </Grid>

          {/* 2. row */}
          <Grid item xs={2}>
            <FormTextField label="Email" />
          </Grid>
          <Grid item xs={2}>
            <FormTextField label="Telefoní číslo" />
          </Grid>

          <Grid item xs={4}>
            <Divider flexItem />
          </Grid>

          {/* 3. row */}
          <Grid item xs={1}>
            <FormTextField label="Rodné číslo" />
          </Grid>
          <Grid item xs={1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Datum narození"
                inputFormat="dd/MM/yyyy"
                value={birthdate}
                onChange={handleBirthdateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={1}>
            <FormTextField label="Výška" endAdornment={<InputAdornment position="end">cm</InputAdornment>} />
          </Grid>
          <Grid item xs={1}>
            <FormTextField label="Váha" endAdornment={<InputAdornment position="end">kg</InputAdornment>} />
          </Grid>

          {/* 4. row */}
          <Grid item xs={1}>
            <FormAutocomplete label="Pohlaví" options={genders} />
          </Grid>
          <Grid item xs={1}>
            <FormAutocomplete label="Mateřský jazyk" options={nativeLanguages} />
          </Grid>
          <Grid item xs={1}>
            <FormAutocomplete label="Zraková korekce" options={visualCorrection} />
          </Grid>
          <Grid item xs={1}>
            <FormAutocomplete label="Stranová dominance" options={sideDominance} />
          </Grid>
        </Grid>
      </Stack>
    </FormCard>
  );
}
