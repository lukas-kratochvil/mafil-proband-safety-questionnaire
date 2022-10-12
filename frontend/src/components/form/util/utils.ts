import { createVisit, IVisit, VisitState } from "../../../data/visit_data";
import { FormPropType } from "../types/types";

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValues = (): FormPropType => ({
  project: null,
  device: null,
  measurementDate: null,
  name: "",
  surname: "",
  personalId: "",
  birthdate: null,
  gender: null,
  nativeLanguage: null,
  height: "",
  weight: "",
  sideDominance: null,
  visualCorrection: null,
  visualCorrectionValue: 0,
  email: "",
  phoneNumber: "",
  answers: [],
});

// Autocomplete component default value must be one of the options provided or null
export const loadFantomFormDefaultValues = (): FormPropType => ({
  ...loadFormDefaultValues(),
  measurementDate: new Date(),
  gender: "Jiné",
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesFromVisit = (visit: IVisit): FormPropType => ({
  project: visit.projectInfo.project ?? null,
  device: visit.projectInfo.device ?? null,
  measurementDate: visit.projectInfo.measurementDate ?? new Date(),
  ...visit.probandInfo,
  answers: visit.answers.map((answer) => ({ ...answer })),
});

// Autocomplete component default value must be one of the options provided or null
export const loadFormDefaultValuesVisitDuplication = (visit: IVisit): FormPropType => ({
  ...loadFormDefaultValuesFromVisit(visit),
  project: null,
  device: null,
});

export const createNewVisitFromFormData = (data: FormPropType, state: VisitState): IVisit =>
  createVisit(
    {
      ...data,
      id: "123",
      createdAt: new Date(),
      visitId: "123",
      pdf: "/dummy.pdf",
      state,
      projectInfo: {
        ...data,
        projectId: "1",
        magnetDeviceId: "1",
        isFantom: true,
        measurementDate: data.measurementDate ?? new Date(),
      },
      probandInfo: {
        ...data,
        birthdate: data.birthdate ?? new Date(),
        height: typeof data.height === "string" ? +data.height : data.height,
        weight: typeof data.weight === "string" ? +data.weight : data.weight,
        gender: "Jiné",
        nativeLanguage: data.nativeLanguage ?? "Angličtina",
        visualCorrection: data.visualCorrection ?? "Ne",
        visualCorrectionValue: typeof data.visualCorrectionValue === "string" ? +data.visualCorrectionValue : 0,
        sideDominance: "Neurčeno",
      },
    },
    state
  );
