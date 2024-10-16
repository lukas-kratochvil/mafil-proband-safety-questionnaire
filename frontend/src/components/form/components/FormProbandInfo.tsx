import { Divider, Grid, Typography, type FilterOptionsState } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { differenceInCalendarYears, isValid } from "date-fns";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InfoTooltip } from "@app/components/informative/InfoTooltip";
import type { FormPropType } from "@app/model/form";
import type { NativeLanguage } from "@app/model/language";
import { fetchNativeLanguages } from "@app/util/mafildb_API/calls";
import { fetchGenders, fetchHandednesses } from "@app/util/server_API/calls";
import type { GenderCode } from "@app/util/server_API/dto";
import { FormAutocomplete } from "../inputs/FormAutocomplete";
import { FormAutocompleteOptions } from "../inputs/FormAutocompleteOptions";
import { FormDatePicker } from "../inputs/FormDatePicker";
import { FormTextField } from "../inputs/FormTextField";
import { visualCorrectionOptions } from "../util/options";
import { CzechSlovakPersonalId, getPersonalIdPart } from "../util/personal-id";
import { FormCardContainer } from "./FormCardContainer";
import type { PhantomFormCardProps } from "./form-card";

const compareNativeLanguages = (a: NativeLanguage, b: NativeLanguage): number => {
  if (a.priority && b.priority) {
    return a.priority - b.priority;
  }
  if (a.priority) {
    return -1;
  }
  return b.priority ? 1 : a.nameEn.localeCompare(b.nameEn);
};

const filterNativeLanguages = (
  options: NativeLanguage[],
  state: FilterOptionsState<NativeLanguage>
): NativeLanguage[] => {
  const inputValue = state.inputValue.trim().toLowerCase();
  return options.filter((option) => {
    const valuesToBeMatched = [option.nativeName, option.nameCs, option.nameEn];
    return valuesToBeMatched.some((optionValue) => optionValue.trim().toLowerCase().startsWith(inputValue));
  });
};

export const FormProbandInfo = ({ isPhantom, disableInputs }: PhantomFormCardProps) => {
  const { i18n, t } = useTranslation("translation", { keyPrefix: "form.probandInfo" });
  const { getFieldState, getValues, resetField, setValue } = useFormContext<FormPropType>();
  const personalIdValue = useWatch<FormPropType, "personalId">({ name: "personalId" });
  const birthdateValue = useWatch<FormPropType, "birthdate">({ name: "birthdate" });
  const genderEntity = useWatch<FormPropType, "gender">({ name: "gender" });
  const visualCorrectionOption = useWatch<FormPropType, "visualCorrection">({ name: "visualCorrection" });

  const [genders, handednesses, nativeLanguages] = useQueries({
    queries: [
      { queryKey: ["genders"], queryFn: fetchGenders },
      { queryKey: ["handednesses"], queryFn: fetchHandednesses },
      { queryKey: ["nativeLanguages"], queryFn: fetchNativeLanguages },
    ],
  });

  // Setting selected gender
  useEffect(() => {
    if (genders.data) {
      if (isPhantom) {
        // Setting gender to 'Other' in the phantom visit
        const genderOther = genders.data.find((gender) => gender.code === "O") ?? null;
        setValue("gender", genderOther, { shouldTouch: true });
      } else {
        // Setting selected gender
        const genderId = getValues("gender.id");

        if (genderId) {
          const selectedGender = genders.data.find((gender) => gender.id === genderId) ?? null;
          setValue("gender", selectedGender, { shouldTouch: true });
        }
      }
    }
  }, [getValues, genders.data, isPhantom, setValue]);

  // Setting selected native language
  useEffect(() => {
    if (nativeLanguages.data) {
      if (isPhantom) {
        // Setting native language to 'Other' in the phantom visit
        const nativeLanguageOther = nativeLanguages.data.find((nativeLanguage) => nativeLanguage.code === "ot") ?? null;
        setValue("nativeLanguage", nativeLanguageOther, { shouldTouch: true });
      } else {
        const nativeLanguageCode = getValues("nativeLanguage.code");

        if (nativeLanguageCode) {
          const selectedNativeLanguage
            = nativeLanguages.data.find((nativeLanguage) => nativeLanguage.code === nativeLanguageCode) ?? null;
          setValue("nativeLanguage", selectedNativeLanguage, { shouldTouch: true });
        }
      }
    }
  }, [nativeLanguages.data, getValues, isPhantom, setValue]);

  // Setting selected handedness
  useEffect(() => {
    if (handednesses.data) {
      if (isPhantom) {
        // Setting handedness to 'Undetermined' in the phantom visit
        const handednessUndetermined = handednesses.data.find((handedness) => handedness.code === "UN") ?? null;
        setValue("handedness", handednessUndetermined, { shouldTouch: true });
      } else {
        const handednessId = getValues("handedness.id");

        if (handednessId) {
          const selectedHandedness = handednesses.data.find((handedness) => handedness.id === handednessId) ?? null;
          setValue("handedness", selectedHandedness, { shouldTouch: true });
        }
      }
    }
  }, [handednesses.data, getValues, isPhantom, setValue]);

  // Auto-fill birthdate and gender from the personalId value
  useEffect(() => {
    // Auto-fill in birthdate and gender only when personalId field is being edited for the first time (until it looses focus)
    const personalIdState = getFieldState("personalId");
    if (personalIdState.isTouched) {
      return;
    }

    const personalId = new CzechSlovakPersonalId(personalIdValue);

    // If it's not Czech or Slovak personal ID leave it like that and don't auto-fill anything
    if (!personalId.isValid()) {
      return;
    }

    setValue("birthdate", personalId.getBirthdate(), { shouldTouch: true });

    // Phantom visit has strictly gender 'Other' - we do not change it here
    if (!isPhantom && genders.data) {
      let genderCode: GenderCode | undefined;

      if (personalId.isMale()) {
        genderCode = "M";
      } else if (personalId.isFemale()) {
        genderCode = "F";
      }

      const genderToBeSet = genders.data.find((gender) => gender.code === genderCode) ?? null;
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
      && birthdateValue
      && isValid(birthdateValue)
      && Math.abs(differenceInCalendarYears(birthdateValue, Date.now())) < 200
      && genderEntity
    ) {
      const personalIdPart = getPersonalIdPart(birthdateValue, genderEntity);
      setValue("personalId", personalIdPart, { shouldTouch: true });
    }
  }, [birthdateValue, genderEntity, getFieldState, personalIdValue, setValue]);

  useEffect(() => {
    const visualCorrectionDioptreValue = getValues("visualCorrectionDioptre");

    // If we don't check the visual correction dioptre value, resetField() causes infinite re-renders
    if (+visualCorrectionDioptreValue !== 0 && visualCorrectionOption?.value !== "yes") {
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
          <FormAutocomplete
            name="gender"
            label={t("gender")}
            options={genders.data}
            isLoading={genders.isLoading}
            disabled={disableInputs || isPhantom}
            sortComparator={(a, b) => a.order - b.order}
            getOptionLabel={(gender) =>
              gender.translations.find((trans) => trans.language.code === i18n.language)?.text ?? ""
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
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
            options={nativeLanguages.data}
            isLoading={nativeLanguages.isLoading}
            disabled={disableInputs || isPhantom}
            sortComparator={compareNativeLanguages}
            filterOptions={filterNativeLanguages}
            getOptionLabel={(nativeLanguage) => nativeLanguage.nativeName}
            isOptionEqualToValue={(option, value) => option.code === value.code}
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
            disabled={disableInputs || isPhantom}
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
            disabled={disableInputs || visualCorrectionOption?.value !== "yes"}
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
          <FormAutocomplete
            name="handedness"
            label={t("handedness")}
            options={handednesses.data}
            isLoading={handednesses.isLoading}
            disabled={disableInputs || isPhantom}
            sortComparator={(a, b) => a.order - b.order}
            getOptionLabel={(handedness) =>
              handedness.translations.find((trans) => trans.language.code === i18n.language)?.text ?? ""
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Grid>
      </Grid>
    </FormCardContainer>
  );
};
