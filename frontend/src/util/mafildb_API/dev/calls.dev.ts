import type { Device } from "@app/model/device";
import type { ValidatedOperatorFormData } from "@app/model/form";
import type { Language } from "@app/model/language";
import type { Project } from "@app/model/project";
import type { DuplicatedProbandVisitSubject, Subject } from "@app/model/subject";
import type {
  Answer,
  CreatedVisitData,
  DuplicatedPhantomVisit,
  DuplicatedProbandVisit,
  RecentVisitsTableVisit,
  VisitDetail,
} from "@app/model/visit";
import type { VisitPDF } from "@app/model/visitPdf";
import { dummyVisits, generateVisitId, PDF_CONTENT } from "@app/util/mafildb_API/dev/data.dev";
import { devicesTest } from "@test/data/devices";
import { nativeLanguagesTest } from "@test/data/languages";
import { projectsTest } from "@test/data/projects";
import { subjectsTest } from "@test/data/subjects";
import {
  fetchCurrentQuestions,
  fetchGender,
  fetchHandedness,
  fetchOperator,
  fetchQuestion,
} from "../../server_API/calls";
import type { PdfDTO, VisitFormAnswerIncludingQuestion } from "../../server_API/dto";
import { MDB_SignatureState, type MDB_CreateVisitInput, type MDB_UpdateVisitSignatureStateInput } from "../dto";

export const fetchLanguagesDev = async (): Promise<Language[]> => nativeLanguagesTest;

export const fetchLanguageDev = async (code: string): Promise<Language> =>
  nativeLanguagesTest.find((language) => code === language.code) ?? nativeLanguagesTest[0]!;

export const fetchSubjectsDev = async (): Promise<Subject[]> => subjectsTest;

export const fetchProjectsDev = async (): Promise<Project[]> => projectsTest;

export const fetchProjectDev = async (uuid: string): Promise<Project> =>
  projectsTest.find((project) => uuid === project.uuid) ?? projectsTest[0]!;

export const fetchDevicesDev = async (): Promise<Device[]> => devicesTest;

export const fetchDeviceDev = async (id: number): Promise<Device> =>
  devicesTest.find((device) => id === device.id) ?? devicesTest[0]!;

export const createVisitDev = async (
  visitFormData: ValidatedOperatorFormData,
  approvalState: MDB_CreateVisitInput["checked"],
  isPhantom: boolean,
  finalizerUsername: string,
  finalizedAt: Date,
  approverUsername?: string,
  approvedAt?: Date
): Promise<CreatedVisitData | never> => {
  const visitId = generateVisitId();
  dummyVisits.push({
    ...visitFormData,
    uuid: visitId,
    approvalState,
    signatureState: MDB_SignatureState.NOT_SET,
    visitId,
    measurementDate: visitFormData.measuredAt,
    created: new Date(),
    isPhantom,
    subject: (await fetchSubjectsDev())[0]!,
    deviceId: visitFormData.device.id,
    heightCm: visitFormData.heightCm,
    weightKg: visitFormData.weightKg,
    visualCorrectionDioptre: visitFormData.visualCorrectionDioptre,
    finalizer: await fetchOperator(finalizerUsername),
    finalizationDate: finalizedAt,
    approver: approverUsername ? await fetchOperator(approverUsername) : null,
    approvalDate: approvedAt ?? null,
    disapprovalReason: "",
    answers: visitFormData.answers.map(
      (answer): Answer => ({
        questionId: answer.questionId,
        answer: answer.answer,
        comment: answer.comment,
      })
    ),
  });
  return dummyVisits[dummyVisits.length - 1]!;
};

export const addPdfToVisitDev = async (pdf: PdfDTO): Promise<VisitPDF> => ({
  id: 1,
  uploaded: new Date(),
  name: pdf.name,
  fileType: "reg_form",
  mimeType: "application/pdf",
  content: pdf.content,
});

export const fetchRecentVisitsDev = async (): Promise<RecentVisitsTableVisit[]> => {
  const currentQuestions = await fetchCurrentQuestions();
  return dummyVisits
    .map((dummyVisit) => {
      // eslint-disable-next-line no-param-reassign
      dummyVisit.answers = currentQuestions.map((question): Answer => {
        const rand = Math.floor(Math.random() * 100) % 2 === 0;
        return {
          questionId: question.id,
          answer: rand ? "YES" : "NO",
          comment: rand ? "Comment" : "",
        };
      });
      return dummyVisit;
    })
    .map(
      (dummyVisit): RecentVisitsTableVisit => ({
        ...dummyVisit,
        device: devicesTest[0]!,
        subject: {
          ...dummyVisit.subject,
          nativeLanguage: nativeLanguagesTest[0]!.code,
        },
      })
    );
};

export const fetchDuplicatedProbandVisitDev = async (visitUuid: string): Promise<DuplicatedProbandVisit | never> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.uuid === visitUuid);

  if (visit === undefined) {
    throw new Error("Visit not found!");
  }

  const [gender, handedness, answersIncludingQuestions] = await Promise.all([
    fetchGender(visit.subject.genderCode),
    fetchHandedness(visit.subject.handednessCode),
    Promise.all(
      visit.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
        const question = await fetchQuestion(answer.questionId);
        return { ...answer, ...question };
      })
    ),
  ]);
  const subject: DuplicatedProbandVisitSubject = {
    ...visit.subject,
    preferredLanguageCode: "en",
  };
  return {
    ...visit,
    subject,
    gender,
    handedness,
    answersIncludingQuestions,
  };
};

export const fetchDuplicatedPhantomVisitDev = async (visitUuid: string): Promise<DuplicatedPhantomVisit | never> => {
  const visit = await fetchDuplicatedProbandVisitDev(visitUuid);
  return {
    ...visit,
    subject: {
      ...visit.subject,
      preferredLanguageCode: null,
    },
  };
};

export const fetchVisitDetailDev = async (visitUuid: string): Promise<VisitDetail | never> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.uuid === visitUuid);

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
  visitUuid: string,
  signatureState: MDB_UpdateVisitSignatureStateInput["registration_signature_status"]
): Promise<string | never> => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.uuid === visitUuid);

  if (visit === undefined) {
    throw new Error("Visit not found!");
  }

  visit.signatureState = signatureState;
  return visit.visitId;
};
