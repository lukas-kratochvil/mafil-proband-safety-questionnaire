import { Divider, Grid, Typography } from "@mui/material";
import { differenceInCalendarYears, isValid } from "date-fns";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InfoTooltip } from "@app/components/informative/InfoTooltip";
import { genders, handednesses, nativeLanguages } from "@app/data/translated_entities_data";
import { defaultNS } from "@app/i18n";
import { FormPropType } from "@app/interfaces/form";
import { VisualCorrection } from "@app/interfaces/visit";
import { FormDatePicker } from "../inputs/FormDatePicker";
import { FormOptionsAutocomplete } from "../inputs/FormOptionsAutocomplete";
import { FormTextField } from "../inputs/FormTextField";
import { FormTranslatedAutocomplete } from "../inputs/FormTranslatedAutocomplete";
import { IPhantomFormCardProps } from "../interfaces/form-card";
import { visualCorrectionOptions } from "../util/options";
import { CzechPersonalId, getPersonalIdFromBirthdateAndGender } from "../util/personal-id";
import { FormCardContainer } from "./FormCardContainer";

export const FormProbandInfo = ({ isPhantom, disableInputs }: IPhantomFormCardProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandInfo" });
  const { getFieldState, resetField, setValue } = useFormContext<FormPropType>();
  const personalIdValue = useWatch<FormPropType, "personalId">({ name: "personalId" });
  const birthdateValue = useWatch<FormPropType, "birthdate">({ name: "birthdate" });
  const genderEntity = useWatch<FormPropType, "gender">({ name: "gender" });
  const visualCorrectionOption = useWatch<FormPropType, "visualCorrection">({ name: "visualCorrection" });

  // Auto-fill birthdate and gender from the personalId value
  useEffect(() => {
    // Auto-fill in birthdate and gender only when personalId field is being edited for the first time (until it looses focus)
    const personalIdState = getFieldState("personalId");
    if (personalIdState.isTouched) {
      return;
    }

    const czechPersonalId = new CzechPersonalId(personalIdValue);
    if (!czechPersonalId.isValid()) {
      return;
    }

    setValue("birthdate", czechPersonalId.getBirthdate(), { shouldTouch: true });

    // Phantom visit has strictly gender 'Other'
    if (!isPhantom) {
      // TODO: must load the gender from DB
      setValue("gender", czechPersonalId.isMale() ? genders[0] : genders[1], { shouldTouch: true });
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
      && genderEntity !== null
    ) {
      setValue("personalId", getPersonalIdFromBirthdateAndGender(birthdateValue, genderEntity), {
        shouldTouch: true,
      });
    }
  }, [birthdateValue, genderEntity, getFieldState, personalIdValue, setValue]);

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
          <FormTranslatedAutocomplete
            name="gender"
            label={t("gender")}
            options={genders}
            disabled={disableInputs || isPhantom}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormTranslatedAutocomplete
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
          <FormTranslatedAutocomplete
            name="handedness"
            label={t("handedness")}
            options={handednesses}
            disabled={disableInputs}
          />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
