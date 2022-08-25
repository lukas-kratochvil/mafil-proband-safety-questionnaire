import { Divider, Grid, Typography } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { genders, nativeLanguages, sideDominance, visualCorrection } from "../../data/form_data";
import { useAuth } from "../../hooks/auth/Auth";
import { InfoTooltip } from "../informative/InfoTooltip";
import { FormCard } from "./FormCard";
import { FormAutocomplete } from "./inputs/FormAutocomplete";
import { FormDatePicker } from "./inputs/FormDatePicker";
import { FormTextField } from "./inputs/FormTextField";

interface IFormProbandInfoProps {
  isAuthEditing: boolean;
}

export const FormProbandInfo = ({ isAuthEditing }: IFormProbandInfoProps) => {
  const { username } = useAuth();
  const { control } = useFormContext();
  const visualCorrectionAnswer = useWatch({
    control,
    name: "Zraková korekce",
  });

  return (
    <FormCard title="Osobní údaje">
      <Grid
        container
        direction="row"
        spacing={2}
        columns={12}
      >
        {/* 1. row */}
        <Grid
          item
          xs={6}
        >
          <FormTextField
            label="Jméno"
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <FormTextField
            label="Příjmení"
            disabled={!isAuthEditing}
          />
        </Grid>

        <Grid
          item
          xs={12}
        >
          <Divider flexItem />
        </Grid>

        {/* 2. row */}
        <Grid
          item
          xs={4}
        >
          <FormTextField
            label="Rodné číslo"
            endAdornmentLabel={
              <InfoTooltip
                text={
                  username === undefined
                    ? "V případě, že nemáte české rodné číslo, zadejte, prosím, číslo pojištěnce."
                    : "Pokud proband nemá české rodné číslo, může zadat číslo pojištěnce."
                }
              />
            }
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={4}
        >
          <FormDatePicker
            label="Datum narození"
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={4}
        >
          <FormAutocomplete
            label="Pohlaví"
            options={genders}
            disabled={!isAuthEditing}
          />
        </Grid>

        {/* 3. row */}
        <Grid
          item
          xs={4}
        >
          <FormAutocomplete
            label="Mateřský jazyk"
            options={nativeLanguages}
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={4}
        >
          <FormTextField
            label="Výška"
            endAdornmentLabel="cm"
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={4}
        >
          <FormTextField
            label="Váha"
            endAdornmentLabel="kg"
            disabled={!isAuthEditing}
          />
        </Grid>

        {/* 4. row */}
        <Grid
          item
          xs={4}
        >
          <FormAutocomplete
            label="Stranová dominance"
            options={sideDominance}
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={4}
        >
          <FormAutocomplete
            label="Zraková korekce"
            options={visualCorrection}
            disabled={!isAuthEditing}
          />
        </Grid>
        <Grid
          item
          xs={4}
        >
          <FormTextField
            label="Hodnota zrakové korekce"
            endAdornmentLabel="D"
            disabled={!isAuthEditing || visualCorrectionAnswer !== "Ano"}
          />
        </Grid>
      </Grid>
    </FormCard>
  );
};
