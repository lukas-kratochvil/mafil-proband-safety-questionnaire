import { IDevice } from "@app/model/device";
import { ValidatedFormData } from "@app/model/form";
import { IProject } from "@app/model/project";
import {
  IDuplicatedVisitIncludingQuestions,
  IRecentVisitsTableVisit,
  IVisitDetail,
  ProbandVisitLanguageCode,
} from "@app/model/visit";
import { dummyVisits, generateVisitId, PDF_CONTENT } from "@app/util/mafildb_API/data.dev";
import { devicesTest } from "../../__tests__/data/devices";
import { projectsTest } from "../../__tests__/data/projects";
import { fetchGender, fetchHandedness, fetchNativeLanguage, fetchOperator, fetchQuestion } from "../server_API/calls";
import { VisitFormAnswerIncludingQuestion } from "../server_API/dto";
import { VisitState } from "./dto";

export const fetchProjectsDev = async (): Promise<IProject[]> => projectsTest;

export const fetchDevicesDev = async (): Promise<IDevice[]> => devicesTest;

export const createVisitDev = async (
  visitFormData: ValidatedFormData,
  state: VisitState,
  isPhantom: boolean,
  finalizerUsername: string,
  probandLanguageCode?: ProbandVisitLanguageCode
): Promise<string | never> => {
  dummyVisits.push({
    ...visitFormData,
    uuid: "",
    state,
    visit_name: generateVisitId(),
    date: visitFormData.measuredAt ?? new Date(),
    created: new Date(),
    is_phantom: isPhantom,
    subject: {
      uuid: Math.random().toString(),
      first_name: visitFormData.name,
      last_name: visitFormData.surname,
      birth_date: visitFormData.birthdate,
      personal_ID: visitFormData.personalId,
      email: visitFormData.email,
      phone: visitFormData.phone,
      preferred_language_id: probandLanguageCode ?? "",
      gender: visitFormData.gender.code,
      native_language_id: visitFormData.nativeLanguage.code,
      handedness: visitFormData.handedness.code,
    },
    project: (await fetchProjectsDev())[0],
    device: (await fetchDevicesDev())[0],
    registration_finalize_user: finalizerUsername,
    registration_finalize_date: new Date(),
    height: visitFormData.heightCm,
    weight: visitFormData.weightKg,
    visual_correction_dioptre: visitFormData.visualCorrectionDioptre,
    registration_answers: visitFormData.answers.map((answer) => ({
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
  const finalizer = await fetchOperator(dummyVisits[0].registration_finalize_user);
  const visits: IRecentVisitsTableVisit[] = [];
  dummyVisits.forEach((visit) => {
    visits.push({
      ...visit,
      visitId: visit.visit_name,
      isPhantom: visit.is_phantom,
      measurementDate: visit.date,
      finalizer,
      heightCm: visit.height,
      weightKg: visit.weight,
      visualCorrectionDioptre: visit.visual_correction_dioptre,
      answers: visit.registration_answers.map((answer) => ({
        questionId: answer.question_id,
        answer: answer.answer,
        comment: answer.comment,
      })),
    });
  });
  return visits;
};

export const fetchDuplicatedVisitDev = async (visitId: string): Promise<IDuplicatedVisitIncludingQuestions | never> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.visit_name === visitId);

  if (visit === undefined) {
    throw new Error("Visit not found!");
  }

  const [gender, nativeLanguage, handedness, answersIncludingQuestions] = await Promise.all([
    fetchGender(visit.subject.gender),
    fetchNativeLanguage(visit.subject.native_language_id),
    fetchHandedness(visit.subject.handedness),
    Promise.all(
      visit.registration_answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
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
    measurementDate: visit.date,
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
