// TODO: delete this file - only for DEV purposes
import { genders, handednesses, nativeLanguages } from "@app/data/translated_entities_data";
import { createVisit } from "@app/data/visit_data";
import { FormPropType } from "@app/interfaces/form";
import { AnswerOption, IVisit, VisitState, VisualCorrection } from "@app/interfaces/visit";

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
        projectId: data.project?.id || null,
        projectAcronym: data.project?.acronym || null,
        deviceId: data.device?.id || null,
        deviceName: data.device?.name || null,
        isPhantom: true,
        measurementDate: data.measurementDate ?? new Date(),
      },
      probandInfo: {
        ...data,
        birthdate: data.birthdate ?? new Date(),
        height: typeof data.height === "string" ? +data.height : data.height,
        weight: typeof data.weight === "string" ? +data.weight : data.weight,
        gender: data.gender ?? genders[2],
        nativeLanguage: data.nativeLanguage ?? nativeLanguages[2],
        visualCorrection: data.visualCorrection?.value ?? VisualCorrection.NO,
        visualCorrectionValue: typeof data.visualCorrectionValue === "string" ? +data.visualCorrectionValue : 0,
        handedness: handednesses[3],
      },
      answers: data.answers.map((answer) => ({ ...answer, answer: answer.answer ?? AnswerOption.NO })),
    },
    state
  );
