import { Divider, Grid, Typography } from "@mui/material";
import { differenceInCalendarYears, isValid } from "date-fns";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { nativeLanguages } from "../../data/form_data";
import { defaultNS } from "../../i18n";
import { FormPropType } from "../../interfaces/form";
import { Gender, VisualCorrection } from "../../interfaces/visit";
import { InfoTooltip } from "../informative/InfoTooltip";
import { FormCardContainer } from "./FormCardContainer";
import { FormAutocomplete } from "./inputs/FormAutocomplete";
import { FormDatePicker } from "./inputs/FormDatePicker";
import { FormOptionsAutocomplete } from "./inputs/FormOptionsAutocomplete";
import { FormTextField } from "./inputs/FormTextField";
import { IPhantomFormCardProps } from "./interfaces/form-card";
import { genderOptions, getOption, sideDominanceOptions, visualCorrectionOptions } from "./util/options";
import { CzechPersonalId, getPersonalIdFromBirthdateAndGender } from "./util/personal-id";

export const FormProbandInfo = ({ isPhantom, disableInputs }: IPhantomFormCardProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandInfo" });
  const { getFieldState, resetField, setValue } = useFormContext();
  const personalIdValue = useWatch<FormPropType, "personalId">({ name: "personalId" });
  const birthdateValue = useWatch<FormPropType, "birthdate">({ name: "birthdate" });
  const genderOption = useWatch<FormPropType, "gender">({ name: "gender" });
  const visualCorrectionOption = useWatch<FormPropType, "visualCorrection">({ name: "visualCorrection" });

  // Auto-fill birthdate and gender from the personalId value
  useEffect(() => {
    const personalIdState = getFieldState("personalId");

    // Auto-fill in birthdate and gender only when personalId field is being edited for the first time (until it looses focus)
    if (personalIdState.isTouched) {
      return;
    }

    const czechPersonalId = new CzechPersonalId(personalIdValue);

    if (!czechPersonalId.isValid()) {
      return;
    }

    setValue("birthdate", czechPersonalId.getBirthdate(), { shouldTouch: true });

    // Phantom visit has strictly gender 'other'
    if (!isPhantom) {
      const gender = czechPersonalId.isMale() ? Gender.MALE : Gender.FEMALE;
      setValue("gender", getOption(genderOptions, gender), { shouldTouch: true });
    }
  }, [getFieldState, isPhantom, personalIdValue, setValue]);

  // Auto-fill part of personalId from the birthdate and gender values
  useEffect(() => {
    const birthdateState = getFieldState("birthdate");
    const genderState = getFieldState("gender");

    // Auto-fill in personalId only when birthdate or gender were not yet edited and one of these fields is being edited for the first time (until it looses focus)
    if (birthdateState.isTouched && genderState.isTouched) {
      return;
    }

    if (
      personalIdValue === ""
      && birthdateValue !== null
      && isValid(birthdateValue)
      && Math.abs(differenceInCalendarYears(birthdateValue, Date.now())) < 200
      && genderOption !== null
    ) {
      setValue("personalId", getPersonalIdFromBirthdateAndGender(birthdateValue, genderOption.value), {
        shouldTouch: true,
      });
    }
  }, [birthdateValue, genderOption, getFieldState, personalIdValue, setValue]);

  useEffect(() => {
    if (visualCorrectionOption?.value !== VisualCorrection.YES) {
      resetField("visualCorrectionValue");
    }
  }, [resetField, visualCorrectionOption]);

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
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormOptionsAutocomplete
            name="gender"
            label={t("gender")}
            options={genderOptions}
            disabled={disableInputs || isPhantom}
          />
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
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormOptionsAutocomplete
            name="visualCorrection"
            label={t("visualCorrection")}
            options={visualCorrectionOptions}
            disabled={disableInputs}
          />
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
            disabled={disableInputs || visualCorrectionOption?.value !== VisualCorrection.YES}
            endAdornmentLabel={
              <>
                <Typography sx={{ marginRight: "0.75rem" }}>D</Typography>
                <InfoTooltip text={t("visualCorrectionValueHint")} />
              </>
            }
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormOptionsAutocomplete
            name="sideDominance"
            label={t("sideDominance")}
            options={sideDominanceOptions}
            disabled={disableInputs}
          />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
