import { Autocomplete, Divider, Grid, InputAdornment, Stack, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { genders, nativeLanguages, sideDominance, visualCorrection } from "./data";
import { FormCard } from "./FormCard";

interface IFormTextFieldProps {
  label: string;
  endAdornment?: React.ReactNode;
  disabled: boolean;
}

const FormTextField = ({ label, endAdornment, disabled }: IFormTextFieldProps) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      disabled={disabled}
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
  disabled: boolean;
}

const FormAutocomplete = ({ label, options, disabled }: IFormAutocompleteProps) => {
  return (
    <Autocomplete
      options={options}
      renderInput={(params) => <TextField {...params} label={label} />}
      disabled={disabled}
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

interface IFormProbandInfoProps {
  isAuthEditing: boolean;
}

export const FormProbandInfo = ({ isAuthEditing }: IFormProbandInfoProps) => {
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
            <FormTextField
              label="Jméno"
              disabled={!isAuthEditing}
            />
          </Grid>
          <Grid item xs={2}>
            <FormTextField
              label="Příjmení"
              disabled={!isAuthEditing}
            />
          </Grid>

          <Grid item xs={4}>
            <Divider flexItem />
          </Grid>

          {/* 2. row */}
          <Grid item xs={1}>
            <FormTextField
              label="Rodné číslo"
              disabled={!isAuthEditing}
            />
          </Grid>
          <Grid item xs={1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Datum narození"
                inputFormat="dd/MM/yyyy"
                value={birthdate}
                onChange={handleBirthdateChange}
                renderInput={(params) => <TextField {...params} />}
                disabled={!isAuthEditing}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={1}>
            <FormTextField
              label="Výška"
              endAdornment={<InputAdornment position="end">cm</InputAdornment>}
              disabled={!isAuthEditing}
            />
          </Grid>
          <Grid item xs={1}>
            <FormTextField
              label="Váha"
              endAdornment={<InputAdornment position="end">kg</InputAdornment>}
              disabled={!isAuthEditing}
            />
          </Grid>

          {/* 3. row */}
          <Grid item xs={1}>
            <FormAutocomplete
              label="Pohlaví" options={genders}
              disabled={!isAuthEditing}
            />
          </Grid>
          <Grid item xs={1}>
            <FormAutocomplete
              label="Mateřský jazyk"
              options={nativeLanguages}
              disabled={!isAuthEditing}
            />
          </Grid>
          <Grid item xs={1}>
            <FormAutocomplete
              label="Zraková korekce"
              options={visualCorrection}
              disabled={!isAuthEditing}
            />
          </Grid>
          <Grid item xs={1}>
            <FormAutocomplete
              label="Stranová dominance"
              options={sideDominance}
              disabled={!isAuthEditing}
            />
          </Grid>
        </Grid>
      </Stack>
    </FormCard>
  );
}
