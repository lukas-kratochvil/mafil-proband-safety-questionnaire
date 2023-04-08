import { Divider, Grid, Typography } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { differenceInCalendarYears, isValid } from "date-fns";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InfoTooltip } from "@app/components/informative/InfoTooltip";
import { defaultNS } from "@app/i18n";
import { FormPropType } from "@app/model/form";
import { VisualCorrection } from "@app/model/visit";
import { fetchGenders, fetchHandednesses, fetchNativeLanguages } from "@app/util/server_API/fetch";
import { FormAutocompleteGenders } from "../inputs/FormAutocompleteGenders";
import { FormAutocompleteHandednesses } from "../inputs/FormAutocompleteHandednesses";
import { FormAutocompleteNativeLanguages } from "../inputs/FormAutocompleteNativeLanguages";
import { FormAutocompleteOptions } from "../inputs/FormAutocompleteOptions";
import { FormDatePicker } from "../inputs/FormDatePicker";
import { FormTextField } from "../inputs/FormTextField";
import { IPhantomFormCardProps } from "../interfaces/form-card";
import { visualCorrectionOptions } from "../util/options";
import { CzechPersonalId, getPersonalIdPart } from "../util/personal-id";
import { GenderCode } from "../util/utils";
import { FormCardContainer } from "./FormCardContainer";

export const FormProbandInfo = ({ isPhantom, disableInputs }: IPhantomFormCardProps) => {
  const { t } = useTranslation(defaultNS, { keyPrefix: "form.probandInfo" });
  const { getFieldState, getValues, resetField, setValue } = useFormContext<FormPropType>();
  const personalIdValue = useWatch<FormPropType, "personalId">({ name: "personalId" });
  const birthdateValue = useWatch<FormPropType, "birthdate">({ name: "birthdate" });
  const genderEntity = useWatch<FormPropType, "gender">({ name: "gender" });
  const visualCorrectionOption = useWatch<FormPropType, "visualCorrection">({ name: "visualCorrection" });

  const [genders, handednesses, nativeLanguages] = useQueries({
    queries: [
      { queryKey: ["genders"], queryFn: fetchGenders, staleTime: Infinity, cacheTime: Infinity },
      { queryKey: ["handednesses"], queryFn: fetchHandednesses, staleTime: Infinity, cacheTime: Infinity },
      { queryKey: ["nativeLanguages"], queryFn: fetchNativeLanguages, staleTime: Infinity, cacheTime: Infinity },
    ],
  });

  // Setting gender
  useEffect(() => {
    if (genders.data !== undefined) {
      if (isPhantom) {
        // Setting gender to 'Other' in the phantom visit
        const genderOther = genders.data.find((gender) => gender.code === "O") || null;
        setValue("gender", genderOther, { shouldTouch: true });
      } else {
        // Setting selected gender
        const genderId = getValues("gender.id");

        if (genderId !== null && genderId !== undefined && genderId !== "") {
          const selectedGender = genders.data.find((gender) => gender.id === genderId) || null;
          setValue("gender", selectedGender, { shouldTouch: true });
        }
      }
    }
  }, [getValues, genders.data, isPhantom, setValue]);

  // Setting selected native language
  useEffect(() => {
    if (nativeLanguages.data !== undefined) {
      const nativeLanguageId = getValues("nativeLanguage.id");

      if (nativeLanguageId !== null && nativeLanguageId !== undefined && nativeLanguageId !== "") {
        const selectedNativeLanguage
          = nativeLanguages.data.find((nativeLanguage) => nativeLanguage.id === nativeLanguageId) || null;
        setValue("nativeLanguage", selectedNativeLanguage, { shouldTouch: true });
      }
    }
  }, [nativeLanguages.data, getValues, setValue]);

  // Setting selected handedness
  useEffect(() => {
    if (handednesses.data !== undefined) {
      const handednessId = getValues("handedness.id");

      if (handednessId !== null && handednessId !== undefined && handednessId !== "") {
        const selectedHandedness = handednesses.data.find((handedness) => handedness.id === handednessId) || null;
        setValue("handedness", selectedHandedness, { shouldTouch: true });
      }
    }
  }, [handednesses.data, getValues, setValue]);

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

    // Phantom visit has strictly gender 'Other' - we do not change it here
    if (!isPhantom && genders.data !== undefined) {
      let code: GenderCode | undefined;

      if (czechPersonalId.isMale()) {
        code = "M";
      } else if (czechPersonalId.isFemale()) {
        code = "F";
      }

      const genderToBeSet = genders.data.find((gender) => gender.code === code) || null;
      setValue("gender", genderToBeSet, { shouldTouch: true });
    }
  }, [genders.data, getFieldState, isPhantom, personalIdValue, setValue]);

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
      const personalIdPart = getPersonalIdPart(birthdateValue, genderEntity);
      setValue("personalId", personalIdPart, { shouldTouch: true });
    }
  }, [birthdateValue, genderEntity, getFieldState, personalIdValue, setValue]);

  useEffect(() => {
    const visualCorrectionDioptreValue = getValues("visualCorrectionDioptre");

    // If we don't check the visual correction dioptre value resetField() causes infinite re-renders
    if (+visualCorrectionDioptreValue !== 0 && visualCorrectionOption?.value !== VisualCorrection.YES) {
      resetField("visualCorrectionDioptre");
    }
  }, [getValues, resetField, visualCorrectionOption]);

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
          <FormAutocompleteGenders
            name="gender"
            label={t("gender")}
            options={genders.data}
            isLoading={genders.isLoading}
            disabled={disableInputs || isPhantom}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <FormAutocompleteNativeLanguages
            name="nativeLanguage"
            label={t("nativeLanguage")}
            options={nativeLanguages.data}
            isLoading={nativeLanguages.isLoading}
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
            name="heightCm"
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
            name="weightKg"
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
          <FormAutocompleteOptions
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
            name="visualCorrectionDioptre"
            label={t("visualCorrectionDioptre")}
            disabled={disableInputs || visualCorrectionOption?.value !== VisualCorrection.YES}
            endAdornmentLabel={
              <>
                <Typography sx={{ marginRight: "0.75rem" }}>D</Typography>
                <InfoTooltip text={t("visualCorrectionDioptreHint")} />
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
          <FormAutocompleteHandednesses
            name="handedness"
            label={t("handedness")}
            options={handednesses.data}
            isLoading={handednesses.isLoading}
            disabled={disableInputs}
          />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
