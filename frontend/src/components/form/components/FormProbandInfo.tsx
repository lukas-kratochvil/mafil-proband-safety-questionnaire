import { Divider, Grid, Typography } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { differenceInCalendarYears, isValid } from "date-fns";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InfoTooltip } from "@app/components/informative/InfoTooltip";
import { defaultNS } from "@app/i18n";
import { FormPropType } from "@app/interfaces/form";
import { VisualCorrection } from "@app/interfaces/visit";
import { fetchGenders, fetchHandednesses, fetchNativeLanguages } from "@app/util/fetch";
import { FormDatePicker } from "../inputs/FormDatePicker";
import { FormOptionsAutocomplete } from "../inputs/FormOptionsAutocomplete";
import { FormTextField } from "../inputs/FormTextField";
import { FormTranslatedAutocomplete } from "../inputs/FormTranslatedAutocomplete";
import { IPhantomFormCardProps } from "../interfaces/form-card";
import { visualCorrectionOptions } from "../util/options";
import { CzechPersonalId, getPersonalIdFromBirthdateAndGender } from "../util/personal-id";
import { GenderCode } from "../util/utils";
import { FormCardContainer } from "./FormCardContainer";

export const FormProbandInfo = ({ isPhantom, disableInputs }: IPhantomFormCardProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandInfo" });
  const { getFieldState, resetField, setValue } = useFormContext<FormPropType>();
  const personalIdValue = useWatch<FormPropType, "personalId">({ name: "personalId" });
  const birthdateValue = useWatch<FormPropType, "birthdate">({ name: "birthdate" });
  const genderEntity = useWatch<FormPropType, "gender">({ name: "gender" });
  const visualCorrectionOption = useWatch<FormPropType, "visualCorrection">({ name: "visualCorrection" });

  const results = useQueries({
    queries: [
      {
        queryKey: ["genders"],
        queryFn: fetchGenders,
      },
      {
        queryKey: ["nativeLanguages"],
        queryFn: fetchNativeLanguages,
      },
      {
        queryKey: ["handednesses"],
        queryFn: fetchHandednesses,
      },
    ],
  });

  // Setting gender to 'Other' in the phantom visit
  useEffect(() => {
    const genders = results[0].data;

    if (isPhantom && genders !== undefined) {
      const genderOther = genders.find((gender) => gender.code === "O") || null;
      setValue("gender", genderOther, { shouldTouch: true });
    }
  }, [isPhantom, results, setValue]);

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

    const genders = results[0].data;

    // Phantom visit has strictly gender 'Other' - we do not change it here
    if (!isPhantom && genders !== undefined) {
      let code: GenderCode | undefined;

      if (czechPersonalId.isMale()) {
        code = "M";
      } else if (czechPersonalId.isFemale()) {
        code = "F";
      }

      const genderToBeSet = genders.find((gender) => gender.code === code) || null;
      setValue("gender", genderToBeSet, { shouldTouch: true });
    }
  }, [getFieldState, isPhantom, personalIdValue, results, setValue]);

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
            options={results[0].data}
            isLoading={results[0].isLoading}
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
            options={results[1].data}
            isLoading={results[1].isLoading}
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
            options={results[2].data}
            isLoading={results[2].isLoading}
            disabled={disableInputs}
          />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
