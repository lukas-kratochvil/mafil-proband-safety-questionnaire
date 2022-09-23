import { Grid, Typography } from "@mui/material";
import { ErrorFeedback } from "./ErrorFeedback";
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
      columns={2}
    >
      {/* 1. row */}
      <Grid
        item
        xs={2}
      >
        <Typography>
          V případě, že budete chtít předat Vaše naměřená data elektronickou cestou, vyplňte údaje níže:
        </Typography>
      </Grid>
      {/* 2. row */}
      <Grid
        item
        xs={2}
        sm={1}
      >
        <FormTextField
          name="email"
          label="Email"
          disabled={!isAuthEditing}
        />
        <ErrorFeedback name="email" />
      </Grid>
      <Grid
        item
        xs={2}
        sm={1}
      >
        <FormTextField
          name="phoneNumber"
          label="Telefonní číslo"
          disabled={!isAuthEditing}
        />
        <ErrorFeedback name="phoneNumber" />
      </Grid>
    </Grid>
  </FormCard>
);
