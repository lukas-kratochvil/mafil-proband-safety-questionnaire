import { devicesTest } from "@app/__tests__/data/devices";
import { projectsTest } from "@app/__tests__/data/projects";
import { subjectsTest } from "@app/__tests__/data/subjects";
import { IDevice } from "@app/model/device";
import { ValidatedFormData } from "@app/model/form";
import { IProject } from "@app/model/project";
import { ISubject } from "@app/model/subject";
import { IDuplicatedVisitIncludingQuestions, IRecentVisitsTableVisit, IVisitDetail } from "@app/model/visit";
import { dummyVisits, generateVisitId, PDF_CONTENT } from "@app/util/mafildb_API/data.dev";
import { fetchGender, fetchHandedness, fetchNativeLanguage, fetchOperator, fetchQuestion } from "../server_API/calls";
import { VisitFormAnswerIncludingQuestion } from "../server_API/dto";
import { ApprovalState, SignatureState } from "./dto";

export const fetchSubjectsDev = async (): Promise<ISubject[]> => subjectsTest;

export const fetchProjectsDev = async (): Promise<IProject[]> => projectsTest;

export const fetchDevicesDev = async (): Promise<IDevice[]> => devicesTest;

export const createVisitDev = async (
  visitFormData: ValidatedFormData,
  approvalState: ApprovalState,
  isPhantom: boolean,
  finalizerUsername: string
): Promise<string | never> => {
  const visitId = generateVisitId();
  dummyVisits.push({
    ...visitFormData,
    uuid: visitId,
    approvalState,
    signatureState: SignatureState.NOT_SET,
    visitId,
    measurementDate: visitFormData.measuredAt ?? new Date(),
    created: new Date(),
    isPhantom,
    subject: (await fetchSubjectsDev())[0],
    project: (await fetchProjectsDev())[0],
    device: (await fetchDevicesDev())[0],
    heightCm: visitFormData.heightCm,
    weightKg: visitFormData.weightKg,
    visualCorrectionDioptre: visitFormData.visualCorrectionDioptre,
    finalizer: await fetchOperator(finalizerUsername),
    finalizationDate: new Date(),
    approver: null,
    approvalDate: null,
    disapprovalReason: "",
    answers: visitFormData.answers.map((answer) => ({ ...answer })),
  });
  return dummyVisits[dummyVisits.length - 1].visitId;
};

export const addPdfToVisitDev = async (): Promise<void> => {
  /* do nothing */
};

export const fetchRecentVisitsDev = async (): Promise<IRecentVisitsTableVisit[]> => dummyVisits;

export const fetchDuplicatedVisitDev = async (visitId: string): Promise<IDuplicatedVisitIncludingQuestions | never> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.visitId === visitId);

  if (visit === undefined) {
    throw new Error("Visit not found!");
  }

  const [gender, nativeLanguage, handedness, answersIncludingQuestions] = await Promise.all([
    fetchGender(visit.subject.genderCode),
    fetchNativeLanguage(visit.subject.nativeLanguageCode),
    fetchHandedness(visit.subject.handednessCode),
    Promise.all(
      visit.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
        const question = await fetchQuestion(answer.questionId);
        return { ...answer, ...question };
      })
    ),
  ]);
  return {
    ...visit,
    gender,
    nativeLanguage,
    handedness,
    answersIncludingQuestions,
  };
};

export const fetchVisitDetailDev = async (visitId: string): Promise<IVisitDetail | never> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.visitId === visitId);

  if (visit === undefined) {
    throw new Error("Visit not found!");
  }

  return {
    ...visit,
    pdf: {
      name: visit.visitId,
      content: PDF_CONTENT,
    },
  };
};

export const updateVisitSignatureStateDev = async (
  visitId: string,
  signatureState: SignatureState
): Promise<string | never> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.visitId === visitId);

  if (visit === undefined) {
    throw new Error("Visit not found!");
  }

  visit.signatureState = signatureState;
  return visit.visitId;
};
