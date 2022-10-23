import { NavigateFunction } from "react-router-dom";
import { UrlBasePaths } from "../../../App";
import { Gender, SideDominance, VisualCorrection } from "../../../data/form_data";
import { AnswerOption, createVisit, IVisit, VisitState } from "../../../data/visit_data";
import { updateDummyVisitState } from "../../../util/fetch.dev";
import { IButtonProps } from "../FormButtons";
import { genderOptions, getOption, sideDominanceOptions, visualCorrectionOptions } from "../types/options";
import { FormPropType } from "../types/types";

// Autocomplete component default value must be one of the options provided or null
export const loadEmptyDefaultValues = (): FormPropType => ({
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
  ...visit.probandInfo,
  gender: getOption(genderOptions, visit.probandInfo.gender),
  sideDominance: getOption(sideDominanceOptions, visit.probandInfo.sideDominance),
  visualCorrection: getOption(visualCorrectionOptions, visit.probandInfo.visualCorrection),
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
        isPhantom: true,
        measurementDate: data.measurementDate ?? new Date(),
      },
      probandInfo: {
        ...data,
        birthdate: data.birthdate ?? new Date(),
        height: typeof data.height === "string" ? +data.height : data.height,
        weight: typeof data.weight === "string" ? +data.weight : data.weight,
        gender: data.gender?.value ?? Gender.OTHER,
        nativeLanguage: data.nativeLanguage ?? "Angličtina",
        visualCorrection: data.visualCorrection?.value ?? VisualCorrection.NO,
        visualCorrectionValue: typeof data.visualCorrectionValue === "string" ? +data.visualCorrectionValue : 0,
        sideDominance: SideDominance.UNDETERMINED,
      },
      answers: data.answers.map((answer) => ({ ...answer, answer: answer.answer ?? AnswerOption.NO })),
    },
    state
  );

export const getDisapproveButtonProps = (id: string | undefined, navigate: NavigateFunction): IButtonProps => ({
  titleLocalizationKey: "form.common.buttons.disapprove",
  onClick: () => {
    // TODO: store changes in DB if made
    updateDummyVisitState(id, VisitState.DISAPPROVED);
    navigate(UrlBasePaths.APPROVAL_ROOM);
  },
  showErrorColor: true,
});