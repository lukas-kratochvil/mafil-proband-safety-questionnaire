import { compareAsc, getUnixTime, subDays } from "date-fns";
import envVars from "@app/envVars";
import type { Device } from "@app/model/device";
import type { ValidatedOperatorFormData } from "@app/model/form";
import type { Language, NativeLanguage } from "@app/model/language";
import type { Project } from "@app/model/project";
import type {
  CreatedVisitData,
  DuplicatedVisitIncludingQuestions,
  ProbandVisitLanguageCode,
  RecentVisitsTableVisit,
  VisitDetail,
} from "@app/model/visit";
import type { VisitPDF } from "@app/model/visitPdf";
import { mafildbApi } from "@app/util/axios/mafildbApi";
import { fetchGender, fetchHandedness, fetchOperator, fetchQuestion } from "../server_API/calls";
import type { OperatorDTO, PdfDTO, VisitFormAnswerIncludingQuestion } from "../server_API/dto";
import {
  MDB_ApprovalState,
  type MDB_AddPdfToVisitInput,
  type MDB_CreateSubjectInput,
  type MDB_CreateVisitInput,
  type MDB_UpdateVisitSignatureStateInput,
  type MDB_VisitDTO,
  type MDB_VisitFileDTO,
  type MDB_VisitFileType,
} from "./dto";
import {
  MDB_RESPONSE_ERROR_ATTR,
  type MDB_AddPdfToVisitResponse,
  type MDB_CreateSubjectResponse,
  type MDB_CreateVisitResponse,
  type MDB_GetDevicesResponse,
  type MDB_GetLanguageResponse,
  type MDB_GetLanguagesResponse,
  type MDB_GetProjectResponse,
  type MDB_GetProjectsResponse,
  type MDB_GetVisitFilesResponse,
  type MDB_GetVisitResponse,
  type MDB_GetVisitsResponse,
  type MDB_UpdateVisitSignatureStateResponse,
} from "./response-types";
import {
  transformDateToMafildbFormat,
  transformGenderCodeForMDB,
  transformHandednessCodeForMDB,
  transformMDBGenderCode,
  transformMDBHandednessCode,
} from "./transformers";

const fetchLanguages = async (): Promise<Language[]> => {
  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).fetchLanguagesDev();
  }

  const { data } = await mafildbApi.get<MDB_GetLanguagesResponse>("languages");

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.results.map((languageDTO) => ({
    ...languageDTO,
    nativeName: languageDTO.name,
    nameCs: languageDTO.name_cs,
    nameEn: languageDTO.name_en,
  }));
};

const fetchLanguage = async (code: string): Promise<Language> => {
  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).fetchLanguageDev(code);
  }

  const { data } = await mafildbApi.get<MDB_GetLanguageResponse>(`languages/${code}`);

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return {
    ...data,
    nativeName: data.name,
    nameCs: data.name_cs,
    nameEn: data.name_en,
  };
};

export const fetchNativeLanguages = async (): Promise<NativeLanguage[]> => fetchLanguages();

export const fetchNativeLanguage = async (code: string): Promise<NativeLanguage> => fetchLanguage(code);

export const fetchProjects = async (): Promise<Project[]> => {
  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).fetchProjectsDev();
  }

  const { data } = await mafildbApi.get<MDB_GetProjectsResponse>("projects");

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.results.map((projectDTO) => ({ ...projectDTO }));
};

export const fetchProject = async (uuid: string): Promise<Project> => {
  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).fetchProjectDev(uuid);
  }

  const { data } = await mafildbApi.get<MDB_GetProjectResponse>(`projects/${uuid}`);

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data;
};

export const fetchDevices = async (): Promise<Device[]> => {
  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).fetchDevicesDev();
  }

  // Only MR devices are relevant for this app
  const params = { type: "MR" };
  const { data } = await mafildbApi.get<MDB_GetDevicesResponse>("devices", { params });

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.results.map((deviceDTO) => ({ ...deviceDTO }));
};

const createVisitSubject = async (
  visitFormData: ValidatedOperatorFormData,
  probandLanguageCode?: ProbandVisitLanguageCode
): Promise<string | never> => {
  const createData: MDB_CreateSubjectInput = {
    first_name: visitFormData.name,
    last_name: visitFormData.surname,
    // TODO: phantom visits do not have the probandLanguageCode filled
    preferred_language_id: probandLanguageCode ?? "",
    birth_date: transformDateToMafildbFormat(visitFormData.birthdate),
    personal_ID: visitFormData.personalId,
    gender: transformGenderCodeForMDB(visitFormData.gender.code),
    native_language_id: visitFormData.nativeLanguage.code,
    handedness: transformHandednessCodeForMDB(visitFormData.handedness.code),
    email: visitFormData.email,
    phone: visitFormData.phone,
  };
  const { data } = await mafildbApi.post<MDB_CreateSubjectResponse>("subjects", createData);

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.uuid;
};

const createVisit = async (
  visitFormData: ValidatedOperatorFormData,
  approvalState: MDB_CreateVisitInput["checked"],
  isPhantom: boolean,
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode?: ProbandVisitLanguageCode,
  approverUsername?: string,
  approvedAt?: Date
): Promise<CreatedVisitData | never> => {
  if (finalizerUsername === undefined) {
    throw new Error("Missing username of the operator who finalized the visit!");
  }

  if (finalizedAt === undefined) {
    throw new Error("Missing visit finalization date!");
  }

  if (approvalState === MDB_ApprovalState.DISAPPROVED && visitFormData.disapprovalReason?.length === 0) {
    throw new Error("Disapproval reason must be properly filled!");
  }

  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).createVisitDev(
      visitFormData,
      approvalState,
      isPhantom,
      finalizerUsername,
      finalizedAt,
      approverUsername,
      approvedAt
    );
  }

  const subjectUuid = await createVisitSubject(visitFormData, probandLanguageCode);
  const createData: MDB_CreateVisitInput = {
    checked: approvalState,
    is_phantom: isPhantom,
    subject_uuid: subjectUuid,
    project_uuid: visitFormData.project.uuid,
    device_id: visitFormData.device.id,
    date: transformDateToMafildbFormat(visitFormData.measuredAt),
    height: visitFormData.heightCm,
    weight: visitFormData.weightKg,
    visual_correction_dioptre: visitFormData.visualCorrectionDioptre,
    registration_answers: visitFormData.answers.map((answer) => ({
      question_id: answer.questionId,
      answer: answer.answer,
      comment: answer.comment,
    })),
    registration_finalize_username: finalizerUsername,
    registration_finalize_date: finalizedAt,
    registration_approve_username: approverUsername,
    registration_approve_date: approvedAt,
    registration_disapprove_reason: visitFormData.disapprovalReason ?? undefined,
  };
  const { data } = await mafildbApi.post<MDB_CreateVisitResponse>("visits", createData);

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return {
    uuid: data.uuid,
    visitId: data.visit_name,
  };
};

export const createFinalizedVisit = async (
  visitFormData: ValidatedOperatorFormData,
  approvalState: MDB_CreateVisitInput["checked"],
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode: ProbandVisitLanguageCode | undefined
): Promise<CreatedVisitData | never> => {
  if (probandLanguageCode === undefined) {
    throw new Error("Missing proband language code!");
  }

  return createVisit(visitFormData, approvalState, false, finalizerUsername, finalizedAt, probandLanguageCode);
};

export const createVisitFromApproval = async (
  visitFormData: ValidatedOperatorFormData,
  state: MDB_CreateVisitInput["checked"],
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode: ProbandVisitLanguageCode | undefined,
  approverUsername: string | undefined,
  approvedAt: Date | undefined
): Promise<CreatedVisitData | never> => {
  if (probandLanguageCode === undefined) {
    throw new Error("Missing proband language code!");
  }

  if (approverUsername === undefined) {
    throw new Error("Missing visit approver username!");
  }

  if (approvedAt === undefined) {
    throw new Error("Missing visit approval date!");
  }

  return createVisit(
    visitFormData,
    state,
    false,
    finalizerUsername,
    finalizedAt,
    probandLanguageCode,
    approverUsername,
    approvedAt
  );
};

export const createPhantomVisit = async (
  visitFormData: ValidatedOperatorFormData,
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined
): Promise<CreatedVisitData | never> =>
  createVisit(visitFormData, MDB_ApprovalState.APPROVED, true, finalizerUsername, finalizedAt);

export const addPdfToVisit = async (visitUuid: string, pdf: PdfDTO): Promise<VisitPDF> => {
  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).addPdfToVisitDev(pdf);
  }

  const addPdfToVisitData: MDB_AddPdfToVisitInput = {
    file_type: "reg_form",
    name: pdf.name,
    mime_type: "application/pdf",
    content: pdf.content,
  };
  const { data } = await mafildbApi.post<MDB_AddPdfToVisitResponse>(`visits/${visitUuid}/files`, addPdfToVisitData);

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return {
    ...data,
    fileType: data.file_type,
    mimeType: data.mime_type,
    content: pdf.content,
  };
};

export const fetchRecentVisits = async (): Promise<RecentVisitsTableVisit[]> => {
  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).fetchRecentVisitsDev();
  }

  // Set limitation to fetch only visits created 14 days ago and newer.
  // MAFILDB returns only visits created X days ago and newer where X is given by the permissions acquired from the provided OIDC access token.
  // MAFILDB_VISITS_MAX_DAYS_OLD env var is used as the upper limit - absolute max value.
  const newerThanDateBound = subDays(new Date().setHours(0, 0, 0, 0), +envVars.MAFILDB_VISITS_MAX_DAYS_OLD);

  // 'newer_than' query param is in seconds
  const params = { newer_than: getUnixTime(newerThanDateBound) };
  const { data } = await mafildbApi.get<MDB_GetVisitsResponse>("visits", { params });

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return Promise.all(
    data.results
      // Check if 14 days bound is really satisfied ('newer_than' query param may not work)
      .filter((visit) => compareAsc(visit.created, newerThanDateBound) > 0)
      .map(async (visit) => {
        let finalizer: OperatorDTO | null = null;
        let approver: OperatorDTO | null = null;

        if (visit.registration_finalize_user) {
          try {
            finalizer = await fetchOperator(visit.registration_finalize_user.username);
          } catch {
            finalizer = null;
          }
        }

        if (visit.registration_approve_user) {
          try {
            approver = await fetchOperator(visit.registration_approve_user.username);
          } catch {
            approver = null;
          }
        }

        return {
          ...visit,
          visitId: visit.visit_name,
          isPhantom: visit.is_phantom,
          measurementDate: visit.date,
          heightCm: visit.height,
          weightKg: visit.weight,
          visualCorrectionDioptre: visit.visual_correction_dioptre,
          answers: visit.registration_answers.map((answer) => ({
            questionId: answer.question_id,
            answer: answer.answer,
            comment: answer.comment,
          })),
          subject: {
            ...visit.subject,
            preferredLanguageCode: visit.subject.preferred_language_id,
            name: visit.subject.first_name,
            surname: visit.subject.last_name,
            birthdate: visit.subject.birth_date,
            personalId: visit.subject.personal_ID,
            genderCode: visit.subject.gender,
            nativeLanguage: visit.subject.native_language_id,
            handednessCode: visit.subject.handedness,
          },
          finalizer,
          finalizationDate: visit.registration_finalize_date,
          approver,
          approvalDate: visit.registration_approve_date,
          disapprovalReason: visit.registration_disapprove_reason,
          approvalState: visit.checked,
          signatureState: visit.registration_signature_status,
        };
      })
  );
};

const fetchVisit = async (visitUuid: string): Promise<MDB_VisitDTO | never> => {
  const { data } = await mafildbApi.get<MDB_GetVisitResponse>(`visits/${visitUuid}`);

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data;
};

export const fetchDuplicatedVisit = async (
  visitUuid: string | undefined
): Promise<DuplicatedVisitIncludingQuestions | never> => {
  if (visitUuid === undefined) {
    throw new Error("Missing visit ID!");
  }

  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).fetchDuplicatedVisitDev(visitUuid);
  }

  const visit = await fetchVisit(visitUuid);

  if (visit.device === null) {
    throw new Error("Visit device is null!");
  }

  if (visit.subject.preferred_language_id === null) {
    throw new Error("Visit subject preferred language is null!");
  }

  if (visit.subject.native_language_id === null) {
    throw new Error("Visit subject native language is null!");
  }

  const [gender, nativeLanguage, handedness, answersIncludingQuestions] = await Promise.all([
    fetchGender(transformMDBGenderCode(visit.subject.gender)),
    fetchNativeLanguage(visit.subject.native_language_id),
    fetchHandedness(transformMDBHandednessCode(visit.subject.handedness)),
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
    device: visit.device,
    visitId: visit.visit_name,
    isPhantom: visit.is_phantom,
    measurementDate: visit.date,
    gender,
    heightCm: visit.height,
    weightKg: visit.weight,
    visualCorrectionDioptre: visit.visual_correction_dioptre,
    handedness,
    answersIncludingQuestions,
    subject: {
      ...visit.subject,
      preferredLanguageCode: visit.subject.preferred_language_id,
      name: visit.subject.first_name,
      surname: visit.subject.last_name,
      birthdate: visit.subject.birth_date,
      personalId: visit.subject.personal_ID,
      genderCode: visit.subject.gender,
      nativeLanguage,
      handednessCode: visit.subject.handedness,
    },
  };
};

const fetchVisitPDF = async (visitUuid: string): Promise<MDB_VisitFileDTO> => {
  type VisitFilesParams = {
    file_type: MDB_VisitFileType;
  };
  const params: VisitFilesParams = { file_type: "reg_form" };
  const { data } = await mafildbApi.get<MDB_GetVisitFilesResponse>(`visits/${visitUuid}/files`, { params });

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  const pdf = data.results.find((file) => file.file_type.includes("reg_form"));

  if (pdf === undefined) {
    throw new Error("Visit PDF not provided!");
  }

  return pdf;
};

export const fetchVisitDetail = async (visitUuid: string | undefined): Promise<VisitDetail | never> => {
  if (visitUuid === undefined) {
    throw new Error("Missing visit ID!");
  }

  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).fetchVisitDetailDev(visitUuid);
  }

  const [visit, visitPDF] = await Promise.all([fetchVisit(visitUuid), fetchVisitPDF(visitUuid)]);
  return {
    uuid: visit.uuid,
    visitId: visit.visit_name,
    isPhantom: visit.is_phantom,
    approvalState: visit.checked,
    signatureState: visit.registration_signature_status,
    pdf: {
      name: visitPDF.name,
      content: visitPDF.content,
    },
  };
};

export const updateVisitSignatureState = async (
  visitUuid: string,
  signatureState: MDB_UpdateVisitSignatureStateInput["registration_signature_status"]
): Promise<string | never> => {
  if (import.meta.env.DEV) {
    return (await import("./calls.dev")).updateVisitSignatureStateDev(visitUuid, signatureState);
  }

  const updateData: MDB_UpdateVisitSignatureStateInput = {
    registration_signature_status: signatureState,
  };
  const { data } = await mafildbApi.patch<MDB_UpdateVisitSignatureStateResponse>(`visits/${visitUuid}`, updateData);

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.registration_signature_status;
};
