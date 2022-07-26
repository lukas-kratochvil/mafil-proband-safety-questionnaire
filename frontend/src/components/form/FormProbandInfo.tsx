import { Divider, Grid, Stack } from "@mui/material";
import { genders, nativeLanguages, sideDominance, visualCorrection } from "./data";
import { FormCard } from "./FormCard";
import { FormAutocomplete, FormDatePicker, FormTextField } from "./FormUtils";

interface IFormProbandInfoProps {
  isAuthEditing: boolean;
}

export const FormProbandInfo = ({ isAuthEditing }: IFormProbandInfoProps) => {
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
            <FormDatePicker 
              label="Datum narození"
              disabled={!isAuthEditing}
            />
          </Grid>
          <Grid item xs={1}>
            <FormTextField
              label="Výška"
              endAdornmentLabel="cm"
              disabled={!isAuthEditing}
            />
          </Grid>
          <Grid item xs={1}>
            <FormTextField
              label="Váha"
              endAdornmentLabel="kg"
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
