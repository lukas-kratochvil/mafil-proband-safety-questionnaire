import { Grid, Typography } from "@mui/material";
import { FormCard } from "./FormCard";
import { FormTextField } from "./inputs/FormTextField";

interface IFormProbandInfoProps {
  isAuthEditing: boolean;
}

export const FormProbandContact = ({ isAuthEditing }: IFormProbandInfoProps) => (
  <FormCard title="Kontaktní údaje">
    <Grid
      container
      direction="row"
      spacing={2}
      columns={4}
    >
      {/* 1. row */}
      <Grid
        item
        xs={4}
      >
        <Typography>
          Pro elektronické zaslání výsledků z měření je nutné vyplnit alespoň 1 z následujících údajů:
        </Typography>
      </Grid>
      {/* 2. row */}
      <Grid
        item
        xs={2}
      >
        <FormTextField
          label="Email"
          disabled={!isAuthEditing}
        />
      </Grid>
      <Grid
        item
        xs={2}
      >
        <FormTextField
          label="Telefonní číslo"
          disabled={!isAuthEditing}
        />
      </Grid>
    </Grid>
  </FormCard>
);
