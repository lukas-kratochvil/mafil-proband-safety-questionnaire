import InfoIcon from "@mui/icons-material/Info";
import { Divider, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { genders, nativeLanguages, sideDominance, visualCorrection } from "../../data/form_data";
import { FormCard } from "./FormCard";
import { FormDatePicker } from "./inputs/FormDatePicker";
import { FormAutocomplete } from "./inputs/FormAutocomplete";
import { FormTextField } from "./inputs/FormTextField";
import { IAuth } from "../../App";

interface IFormProbandInfoProps {
  auth?: IAuth;
  isAuthEditing: boolean;
}

export const FormProbandInfo = ({ auth, isAuthEditing }: IFormProbandInfoProps) => (
  <FormCard title="Osobní údaje">
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
        <Grid
          item
          xs={2}
        >
          <FormTextField
            label="Jméno"
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={2}
        >
          <FormTextField
            label="Příjmení"
            disabled={!isAuthEditing}
          />
        </Grid>

        <Grid
          item
          xs={4}
        >
          <Divider flexItem />
        </Grid>

        {/* 2. row */}
        <Grid
          item
          xs={1}
        >
          <FormTextField
            label="Rodné číslo"
            endAdornmentLabel={
              auth === undefined
              && (
                <Tooltip
                  title={
                    <Typography>V případě, že nemáte české rodné číslo, zadejte, prosím, číslo pojištěnce.</Typography>
                  }
                  arrow
                  placement="top-start"
                >
                  <InfoIcon sx={{ color: "#2da2e1" }} />
                </Tooltip>
              )
            }
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={1}
        >
          <FormDatePicker
            label="Datum narození"
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={1}
        >
          <FormTextField
            label="Výška"
            endAdornmentLabel="cm"
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={1}
        >
          <FormTextField
            label="Váha"
            endAdornmentLabel="kg"
            disabled={!isAuthEditing}
          />
        </Grid>

        {/* 3. row */}
        <Grid
          item
          xs={1}
        >
          <FormAutocomplete
            label="Pohlaví"
            options={genders}
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={1}
        >
          <FormAutocomplete
            label="Mateřský jazyk"
            options={nativeLanguages}
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={1}
        >
          <FormAutocomplete
            label="Zraková korekce"
            options={visualCorrection}
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={1}
        >
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
