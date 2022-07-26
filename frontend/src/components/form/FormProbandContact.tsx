import { Grid, Stack, TextField, Typography } from "@mui/material";
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

interface IFormProbandInfoProps {
  isAuthEditing: boolean;
}

export const FormProbandContact = ({ isAuthEditing }: IFormProbandInfoProps) => {
  return (
    <FormCard title={"Kontaktní údaje"}>
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
          <Grid item xs={4}>
            <Typography>
              Pro elektronické zaslání výsledků z měření je potřeba vyplnit alespoň 1 z následujících údajů:
            </Typography>
          </Grid>
          {/* 2. row */}
          <Grid item xs={2}>
            <FormTextField
              label="Email"
              disabled={!isAuthEditing}
            />
          </Grid>
          <Grid item xs={2}>
            <FormTextField
              label="Telefonní číslo"
              disabled={!isAuthEditing}
            />
          </Grid>
        </Grid>
      </Stack>
    </FormCard>
  );
}
