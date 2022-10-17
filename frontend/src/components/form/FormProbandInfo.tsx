import { Divider, Grid, Typography } from "@mui/material";
import { addYears, differenceInCalendarYears, isValid } from "date-fns";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { rodnecislo } from "rodnecislo";
import { Gender, nativeLanguages, SideDominance, VisualCorrection } from "../../data/form_data";
import { defaultNS } from "../../i18n";
import { InfoTooltip } from "../informative/InfoTooltip";
import { ErrorFeedback } from "./ErrorFeedback";
import { FormCardContainer } from "./FormCardContainer";
import { FormAutocomplete } from "./inputs/FormAutocomplete";
import { FormDatePicker } from "./inputs/FormDatePicker";
import { FormTextField } from "./inputs/FormTextField";
import { FormPropType, IFantomFormInputsProps } from "./types/types";

export const FormProbandInfo = ({ isFantom, disableInputs }: IFantomFormInputsProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandInfo" });
  const { resetField, setValue } = useFormContext();
  const personalIdValue = useWatch<FormPropType, "personalId">({ name: "personalId" });
  const birthdateValue = useWatch<FormPropType, "birthdate">({ name: "birthdate" });
  const genderValue = useWatch<FormPropType, "gender">({ name: "gender" });
  const visualCorrectionAnswer = useWatch<FormPropType, "visualCorrection">({ name: "visualCorrection" });

  useEffect(() => {
    const czechPersonalId = rodnecislo(personalIdValue);

    if (czechPersonalId.isValid()) {
      if (birthdateValue === null) {
        let newBirthdate = czechPersonalId.birthDate();

        // When proband's personal ID starts with '00' and current year is 2022, it's more likely proband was born in the year 2000 than 1900
        if (Math.abs(differenceInCalendarYears(newBirthdate, Date.now())) >= 100) {
          newBirthdate = addYears(newBirthdate, 100);
        }

        setValue("birthdate", newBirthdate);
      }

      if (!isFantom && genderValue === null) {
        if (czechPersonalId.isMale()) {
          setValue("gender", Gender.MAN);
        } else if (czechPersonalId.isFemale()) {
          setValue("gender", Gender.WOMAN);
        }
      }
    }
  }, [setValue, personalIdValue, birthdateValue, genderValue, isFantom]);

  useEffect(() => {
    if (personalIdValue === "" && birthdateValue !== null && isValid(birthdateValue) && genderValue !== null) {
      const year = birthdateValue.getFullYear();
      const month = birthdateValue.getMonth() + 1;
      const day = genderValue === Gender.WOMAN ? birthdateValue.getDate() + 50 : birthdateValue.getDate();

      setValue("personalId", `${year % 100}${month < 10 ? `0${month}` : month}${day < 10 ? `0${day}` : day}`);
    }
  }, [setValue, birthdateValue, genderValue, personalIdValue]);

  useEffect(() => {
    if (visualCorrectionAnswer !== VisualCorrection.YES) {
      resetField("visualCorrectionValue");
    }
  }, [resetField, visualCorrectionAnswer]);

  return (
    <FormCardContainer title={t("title")}>
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
            label={t("name")}
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
            label={t("surname")}
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
            label={t("personalId")}
            endAdornmentLabel={<InfoTooltip text={t("personalIdHint")} />}
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
            label={t("birthdate")}
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
            label={t("gender")}
            options={Object.values(Gender)}
            disabled={disableInputs || isFantom}
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
            label={t("nativeLanguage")}
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
            label={t("height")}
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
            label={t("weight")}
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
            label={t("visualCorrection")}
            options={Object.values(VisualCorrection)}
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
            label={t("visualCorrectionValue")}
            disabled={disableInputs || visualCorrectionAnswer !== VisualCorrection.YES}
            endAdornmentLabel={
              <>
                <Typography sx={{ marginRight: "0.75rem" }}>D</Typography>
                <InfoTooltip text={t("visualCorrectionValueHint")} />
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
            label={t("sideDominance")}
            options={Object.values(SideDominance)}
            disabled={disableInputs}
          />
          <ErrorFeedback name="sideDominance" />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
