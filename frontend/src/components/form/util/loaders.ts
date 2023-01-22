import { FormPropType } from "@interfaces/form";
import { Gender, IVisit } from "@interfaces/visit";
import { genderOptions, getOption, handednessOptions, visualCorrectionOptions } from "./options";

// Autocomplete component default value must be one of the options provided or null
export const loadEmptyDefaultValues = (): FormPropType => ({
  project: null,
  device: null,
  measurementDate: null,
  disapprovalReason: null,
  name: "",
  surname: "",
  personalId: "",
  birthdate: null,
  gender: null,
  nativeLanguage: null,
  height: "",
  weight: "",
  handedness: null,
  visualCorrection: null,
  visualCorrectionValue: 0,
  email: "",
  phone: "",
  answers: [],
});

// Autocomplete component default value must be one of the options provided or null
export const loadPhantomFormDefaultValues = (): FormPropType => ({
  ...loadEmptyDefaultValues(),
  measurementDate: new Date(),
  gender: getOption(genderOptions, Gender.OTHER),
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesFromVisit = (visit: IVisit): FormPropType => ({
  project: visit.projectInfo.project ?? null,
  device: visit.projectInfo.device ?? null,
  measurementDate: visit.projectInfo.measurementDate ?? new Date(),
  disapprovalReason: visit.projectInfo.disapprovalReason,
  ...visit.probandInfo,
  gender: getOption(genderOptions, visit.probandInfo.gender),
  handedness: getOption(handednessOptions, visit.probandInfo.handedness),
  visualCorrection: getOption(visualCorrectionOptions, visit.probandInfo.visualCorrection),
  answers: visit.answers.map((answer) => ({ ...answer })),
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesVisitDuplication = (visit: IVisit): FormPropType => ({
  ...loadFormDefaultValuesFromVisit(visit),
  project: null,
  device: null,
});
