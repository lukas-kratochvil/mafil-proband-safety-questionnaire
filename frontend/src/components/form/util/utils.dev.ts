import { createVisit } from "@data/visit_data";
import { FormPropType } from "@interfaces/form";
import { AnswerOption, Gender, IVisit, SideDominance, VisitState, VisualCorrection } from "@interfaces/visit";

// TODO: delete this - only for DEV purposes
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
        sideDominance: SideDominance.UNDETERMINED,
      },
      answers: data.answers.map((answer) => ({ ...answer, answer: answer.answer ?? AnswerOption.NO })),
    },
    state
  );
