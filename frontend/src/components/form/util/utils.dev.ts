// TODO: delete this file - only for DEV purposes
import { createVisit } from "@app/data/visit_data";
import { FormPropType } from "@app/interfaces/form";
import { AnswerOption, Gender, Handedness, IVisit, VisitState, VisualCorrection } from "@app/interfaces/visit";

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
        deviceId: "1",
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
        handedness: Handedness.UNDETERMINED,
      },
      answers: data.answers.map((answer) => ({ ...answer, answer: answer.answer ?? AnswerOption.NO })),
    },
    state
  );
