import { Divider, Grid, Typography } from "@mui/material";
import { isValid } from "date-fns";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { rodnecislo } from "rodnecislo";
import { genders, nativeLanguages, sideDominance, visualCorrection } from "../../data/form_data";
import { InfoTooltip } from "../informative/InfoTooltip";
import { ErrorFeedback } from "./ErrorFeedback";
import { FormCard } from "./FormCard";
import { FormAutocomplete } from "./inputs/FormAutocomplete";
import { FormDatePicker } from "./inputs/FormDatePicker";
import { FormTextField } from "./inputs/FormTextField";

interface IFormProbandInfoProps {
  disableInputs: boolean;
}

export const FormProbandInfo = ({ disableInputs }: IFormProbandInfoProps) => {
  const { resetField, setValue } = useFormContext();
  const personalIdValue = useWatch({ name: "personalId" });
  const birthdateValue = useWatch({ name: "birthdate" });
  const genderValue = useWatch({ name: "gender" });
  const visualCorrectionAnswer = useWatch({ name: "visualCorrection" });

  useEffect(() => {
    const czechPersonalId = rodnecislo(personalIdValue);

    if (czechPersonalId.isValid()) {
      setValue("birthdate", czechPersonalId.birthDate());

      if (czechPersonalId.isMale()) {
        setValue("gender", "Muž");
      } else if (czechPersonalId.isFemale()) {
        setValue("gender", "Žena");
      }
    }
  }, [setValue, personalIdValue]);

  useEffect(() => {
    if (personalIdValue === "" && isValid(birthdateValue) && genderValue !== null) {
      const year = birthdateValue.getFullYear();
      const month = birthdateValue.getMonth() + 1;
      const day = genderValue === "Žena" ? birthdateValue.getDate() + 50 : birthdateValue.getDate();

      setValue("personalId", `${year % 100}${month < 10 ? `0${month}` : month}${day < 10 ? `0${day}` : day}`);
    }
  }, [setValue, birthdateValue, genderValue, personalIdValue]);

  useEffect(() => {
    if (visualCorrectionAnswer !== "Ano") {
      resetField("visualCorrectionValue");
    }
  }, [resetField, visualCorrectionAnswer]);

  return (
    <FormCard title="Osobní údaje">
      <Grid
        container
        direction="row"
        spacing="1rem"
        columns={12}
      >
        <Grid
          item
          xs={12}
          sm={6}
        >
          <FormTextField
            name="name"
            label="Jméno"
            disabled={disableInputs}
          />
          <ErrorFeedback name="name" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
        >
          <FormTextField
            name="surname"
            label="Příjmení"
            disabled={disableInputs}
          />
          <ErrorFeedback name="surname" />
        </Grid>

        <Grid
          item
          xs={12}
        >
          <Divider flexItem />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormTextField
            name="personalId"
            label="Rodné číslo"
            endAdornmentLabel={
              <InfoTooltip text="V případě, že nemáte české rodné číslo, zadejte, prosím, číslo pojištěnce." />
            }
            disabled={disableInputs}
          />
          <ErrorFeedback name="personalId" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormDatePicker
            name="birthdate"
            label="Datum narození"
            disabled={disableInputs}
            maxDate={new Date()}
          />
          <ErrorFeedback name="birthdate" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormAutocomplete
            name="gender"
            label="Pohlaví"
            options={genders}
            disabled={disableInputs}
          />
          <ErrorFeedback name="gender" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormAutocomplete
            name="nativeLanguage"
            label="Mateřský jazyk"
            options={nativeLanguages}
            disabled={disableInputs}
          />
          <ErrorFeedback name="nativeLanguage" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormTextField
            name="height"
            label="Výška"
            endAdornmentLabel="cm"
            disabled={disableInputs}
          />
          <ErrorFeedback name="height" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormTextField
            name="weight"
            label="Váha"
            endAdornmentLabel="kg"
            disabled={disableInputs}
          />
          <ErrorFeedback name="weight" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormAutocomplete
            name="visualCorrection"
            label="Zraková korekce"
            options={visualCorrection}
            disabled={disableInputs}
          />
          <ErrorFeedback name="visualCorrection" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormTextField
            name="visualCorrectionValue"
            label="Hodnota zrakové korekce"
            disabled={disableInputs || visualCorrectionAnswer !== "Ano"}
            endAdornmentLabel={
              <>
                <Typography sx={{ marginRight: "0.75rem" }}>D</Typography>
                <InfoTooltip text="Kladné dioptrie značí dalekozrakost, což znamená, že vidíte hůře na blízko. Naopak záporné dioptrie značí krátkozrakost, tedy vidíte hůře na dálku." />
              </>
            }
          />
          <ErrorFeedback name="visualCorrectionValue" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormAutocomplete
            name="sideDominance"
            label="Stranová dominance"
            options={sideDominance}
            disabled={disableInputs}
          />
          <ErrorFeedback name="sideDominance" />
        </Grid>
      </Grid>
    </FormCard>
  );
};
