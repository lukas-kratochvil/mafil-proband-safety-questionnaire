import { ValidatedFormData } from "@app/model/form";
import {
  IDuplicatedVisitIncludingQuestions,
  IRecentVisitsTableVisit,
  IVisitDetail,
  ProbandVisitLanguageCode,
} from "@app/model/visit";
import { devicesDev, dummyVisits, generateVisitId, PDF_CONTENT, projectsDev } from "@app/util/mafildb_API/data.dev";
import { fetchGender, fetchHandedness, fetchNativeLanguage, fetchOperator, fetchQuestion } from "../server_API/calls";
import { VisitFormAnswerIncludingQuestion } from "../server_API/dto";
import { IDeviceDTO, IProjectDTO, VisitState } from "./dto";

export const fetchProjectsDev = async (): Promise<IProjectDTO[]> => projectsDev;

export const fetchDevicesDev = async (): Promise<IDeviceDTO[]> => devicesDev;

export const createVisitDev = async (
  visitFormData: ValidatedFormData,
  state: VisitState,
  isPhantom: boolean,
  finalizerUsername: string,
  probandLanguageCode?: ProbandVisitLanguageCode
): Promise<string | never> => {
  dummyVisits.push({
    ...visitFormData,
    state,
    visit_name: generateVisitId(),
    date: new Date(),
    created: new Date(),
    is_phantom: isPhantom,
    preferred_language_id: probandLanguageCode ?? "",
    finalizer_username: finalizerUsername,
    measurement_date: visitFormData.measuredAt ?? new Date(),
    project_uuid: visitFormData.project?.uuid ?? "",
    device_id: visitFormData.device?.id ?? "",
    personal_id: visitFormData.personalId,
    birthdate: visitFormData.birthdate,
    gender_code: visitFormData.gender.code,
    native_language_code: visitFormData.nativeLanguage.code,
    height: visitFormData.heightCm,
    weight: visitFormData.weightKg,
    visual_correction_dioptre: visitFormData.visualCorrectionDioptre,
    handedness_code: visitFormData.handedness.code,
    answers: visitFormData.answers.map((answer) => ({
      question_id: answer.questionId,
      answer: answer.answer,
      comment: answer.comment,
    })),
  });
  return dummyVisits[dummyVisits.length - 1].visit_name;
};

export const addPdfToVisitDev = async (): Promise<void> => {
  /* do nothing */
};

export const fetchRecentVisitsDev = async (): Promise<IRecentVisitsTableVisit[]> => {
  const [projects, devices, finalizer] = await Promise.all([
    fetchProjectsDev(),
    fetchDevicesDev(),
    fetchOperator(dummyVisits[0].finalizer_username),
  ]);
  const visits: IRecentVisitsTableVisit[] = [];
  dummyVisits.forEach((visit) => {
    const project = projects.find((proj) => proj.uuid === visit.project_uuid);
    const device = devices.find((dev) => dev.id === visit.device_id);

    // if project or device doesn't exist we skip the visit
    if (project !== undefined && device !== undefined) {
      visits.push({
        ...visit,
        visitId: visit.visit_name,
        isPhantom: visit.is_phantom,
        project,
        device,
        measurementDate: visit.measurement_date,
        finalizer,
        probandLanguageCode: visit.preferred_language_id,
        personalId: visit.personal_id,
        heightCm: visit.height,
        weightKg: visit.weight,
        visualCorrectionDioptre: visit.visual_correction_dioptre,
        answers: visit.answers.map((answer) => ({
          questionId: answer.question_id,
          answer: answer.answer,
          comment: answer.comment,
        })),
      });
    }
  });
  return visits;
};

export const fetchDuplicatedVisitDev = async (visitId: string): Promise<IDuplicatedVisitIncludingQuestions | never> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.visit_name === visitId);

  if (visit === undefined) {
    throw new Error("Visit not found!");
  }

  const [gender, nativeLanguage, handedness, answersIncludingQuestions] = await Promise.all([
    fetchGender(visit.gender_code),
    fetchNativeLanguage(visit.native_language_code),
    fetchHandedness(visit.handedness_code),
    Promise.all(
      visit.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
        const question = await fetchQuestion(answer.question_id);
        return {
          answer: answer.answer,
          comment: answer.comment,
          questionId: question.id,
          mustBeApproved: question.mustBeApproved,
          partNumber: question.partNumber,
          order: question.order,
          hiddenByGenders: question.hiddenByGenders,
          translations: question.translations,
          updatedAt: question.updatedAt,
        };
      })
    ),
  ]);
  return {
    ...visit,
    visitId: visit.visit_name,
    isPhantom: visit.is_phantom,
    measurementDate: visit.measurement_date,
    probandLanguageCode: visit.preferred_language_id,
    personalId: visit.personal_id,
    gender,
    nativeLanguage,
    heightCm: visit.height,
    weightKg: visit.weight,
    visualCorrectionDioptre: visit.visual_correction_dioptre,
    handedness,
    answersIncludingQuestions,
  };
};

export const fetchVisitDetailDev = async (visitId: string): Promise<IVisitDetail | never> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.visit_name === visitId);

  if (visit === undefined) {
    throw new Error("Visit not found!");
  }

  return {
    visitId: visit.visit_name,
    isPhantom: visit.is_phantom,
    state: visit.state,
    pdf: {
      name: visit.visit_name,
      content: PDF_CONTENT,
    },
  };
};

export const updateVisitStateDev = async (visitId: string, state: VisitState): Promise<string | never> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.visit_name === visitId);

  if (visit === undefined) {
    throw new Error("Visit not found!");
  }

  visit.state = state;
  return visit.visit_name;
};
