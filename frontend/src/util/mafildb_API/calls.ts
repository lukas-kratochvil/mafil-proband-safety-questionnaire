import { compareAsc, subDays } from "date-fns";
import type { IDevice } from "@app/model/device";
import type { ValidatedOperatorFormData } from "@app/model/form";
import type { ILanguage, INativeLanguage } from "@app/model/language";
import type { IProject } from "@app/model/project";
import type {
  CreatedVisitData,
  IDuplicatedVisitIncludingQuestions,
  IRecentVisitsTableVisit,
  IVisitDetail,
  ProbandVisitLanguageCode,
} from "@app/model/visit";
import type { IVisitPDF } from "@app/model/visitPdf";
import { mafildbApi } from "@app/util/axios/mafildbApi";
import { fetchGender, fetchHandedness, fetchOperator, fetchQuestion } from "../server_API/calls";
import type { IOperatorDTO, IPdfDTO, VisitFormAnswerIncludingQuestion } from "../server_API/dto";
import {
  addPdfToVisitDev,
  createVisitDev,
  fetchDevicesDev,
  fetchDuplicatedVisitDev,
  fetchLanguageDev,
  fetchLanguagesDev,
  fetchProjectDev,
  fetchProjectsDev,
  fetchRecentVisitsDev,
  fetchVisitDetailDev,
  updateVisitSignatureStateDev,
} from "./calls.dev";
import { transformGenderCodeForMDB } from "./codeMappers";
import {
  MDB_ApprovalState,
  type MDB_IAddPdfToVisitInput,
  type MDB_ICreateSubjectInput,
  type MDB_ICreateVisitInput,
  type MDB_IUpdateVisitSignatureStateInput,
  type MDB_IVisitDTO,
  type MDB_IVisitFileDTO,
  type MDB_SignatureState,
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

const fetchLanguages = async (): Promise<ILanguage[]> => {
  if (import.meta.env.DEV) {
    return fetchLanguagesDev();
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

const fetchLanguage = async (code: string): Promise<ILanguage> => {
  if (import.meta.env.DEV) {
    return fetchLanguageDev(code);
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

export const fetchNativeLanguages = async (): Promise<INativeLanguage[]> => fetchLanguages();

export const fetchNativeLanguage = async (code: string): Promise<INativeLanguage> => fetchLanguage(code);

export const fetchProjects = async (): Promise<IProject[]> => {
  if (import.meta.env.DEV) {
    return fetchProjectsDev();
  }

  const { data } = await mafildbApi.get<MDB_GetProjectsResponse>("projects");

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.results.map((projectDTO) => ({ ...projectDTO }));
};

export const fetchProject = async (uuid: string): Promise<IProject> => {
  if (import.meta.env.DEV) {
    return fetchProjectDev(uuid);
  }

  const { data } = await mafildbApi.get<MDB_GetProjectResponse>(`projects/${uuid}`);

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data;
};

export const fetchDevices = async (): Promise<IDevice[]> => {
  if (import.meta.env.DEV) {
    return fetchDevicesDev();
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
  const createData: MDB_ICreateSubjectInput = {
    first_name: visitFormData.name,
    last_name: visitFormData.surname,
    // TODO: phantom visits do not have the probandLanguageCode filled
    preferred_language_code: probandLanguageCode ?? "",
    birth_date: visitFormData.birthdate,
    personal_ID: visitFormData.personalId,
    gender: transformGenderCodeForMDB(visitFormData.gender.code),
    native_language_code: visitFormData.nativeLanguage.code,
    handedness: visitFormData.handedness.code,
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
  approvalState: MDB_ApprovalState,
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

  if (import.meta.env.DEV) {
    return createVisitDev(
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
  const createData: MDB_ICreateVisitInput = {
    checked: approvalState,
    is_phantom: isPhantom,
    subject_uuid: subjectUuid,
    project_uuid: visitFormData.project.uuid,
    device_id: visitFormData.device.id,
    date: visitFormData.measuredAt,
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
    registration_approve_username: approverUsername ?? "",
    registration_approve_date: approvedAt ?? null,
    registration_disapprove_reason: visitFormData.disapprovalReason,
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
  approvalState: MDB_ApprovalState,
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
  state: MDB_ApprovalState,
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
    throw new Error("Proband language code is undefined!");
  }

  if (approvedAt === undefined) {
    throw new Error("Proband language code is undefined!");
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

export const addPdfToVisit = async (visitUuid: string, pdf: IPdfDTO): Promise<IVisitPDF> => {
  if (import.meta.env.DEV) {
    return addPdfToVisitDev(pdf);
  }

  const addPdfToVisitData: MDB_IAddPdfToVisitInput = {
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

export const fetchRecentVisits = async (): Promise<IRecentVisitsTableVisit[]> => {
  if (import.meta.env.DEV) {
    return fetchRecentVisitsDev();
  }

  // Set limitation to fetch only visits created 14 days ago and newer.
  // MAFILDB returns only visits created X days ago and newer where X is given by the permissions acquired from the provided OIDC access token.
  const newerThanDateBound = subDays(new Date().setHours(0, 0, 0, 0), 14);

  const params = { newer_than: newerThanDateBound.valueOf() };
  const { data } = await mafildbApi.get<MDB_GetVisitsResponse>("visits", { params });

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  const visits: IRecentVisitsTableVisit[] = [];
  data.results
    // Check if 14 days bound is really satisfied ('newer_than' query param may not work)
    .filter((visit) => compareAsc(visit.created, newerThanDateBound) > 0)
    .forEach(async (visit) => {
      const nativeLanguage = await fetchNativeLanguage(visit.subject.native_language_code);

      let finalizer: IOperatorDTO;
      let approver: IOperatorDTO | null = null;

      try {
        finalizer = await fetchOperator(visit.registration_finalize_user.username);

        if (finalizer === undefined) {
          throw new Error("Finalizer not found!");
        }
      } catch (e) {
        // TODO: what to do when finalizer not found? Skip the visit?
        return;
      }

      try {
        if (visit.registration_approve_user !== null) {
          approver = await fetchOperator(visit.registration_approve_user.username);

          if (approver === undefined) {
            throw new Error("Approver not found!");
          }
        }
      } catch (e) {
        // TODO: what to do when approver not found? Skip the visit?
        return;
      }

      visits.push({
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
          preferredLanguageCode: visit.subject.preferred_language_code,
          name: visit.subject.first_name,
          surname: visit.subject.last_name,
          birthdate: visit.subject.birth_date,
          personalId: visit.subject.personal_ID,
          genderCode: visit.subject.gender,
          nativeLanguage,
          handednessCode: visit.subject.handedness,
        },
        finalizer,
        finalizationDate: visit.registration_finalize_date,
        approver,
        approvalDate: visit.registration_approve_date,
        disapprovalReason: visit.registration_disapprove_reason,
        approvalState: visit.checked,
        signatureState: visit.registration_signature_status,
      });
    });

  return visits;
};

const fetchVisit = async (visitUuid: string): Promise<MDB_IVisitDTO | never> => {
  const { data } = await mafildbApi.get<MDB_GetVisitResponse>(`visits/${visitUuid}`);

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data;
};

export const fetchDuplicatedVisit = async (
  visitUuid: string | undefined
): Promise<IDuplicatedVisitIncludingQuestions | never> => {
  if (visitUuid === undefined) {
    throw new Error("Missing visit ID!");
  }

  if (import.meta.env.DEV) {
    return fetchDuplicatedVisitDev(visitUuid);
  }

  const visit = await fetchVisit(visitUuid);
  const [gender, nativeLanguage, handedness, answersIncludingQuestions] = await Promise.all([
    fetchGender(visit.subject.gender),
    fetchNativeLanguage(visit.subject.native_language_code),
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
    heightCm: visit.height,
    weightKg: visit.weight,
    visualCorrectionDioptre: visit.visual_correction_dioptre,
    handedness,
    answersIncludingQuestions,
    subject: {
      ...visit.subject,
      preferredLanguageCode: visit.subject.preferred_language_code,
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

const fetchVisitPDF = async (visitUuid: string): Promise<MDB_IVisitFileDTO> => {
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

export const fetchVisitDetail = async (visitUuid: string | undefined): Promise<IVisitDetail | never> => {
  if (visitUuid === undefined) {
    throw new Error("Missing visit ID!");
  }

  if (import.meta.env.DEV) {
    return fetchVisitDetailDev(visitUuid);
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
  signatureState: MDB_SignatureState
): Promise<string | never> => {
  if (import.meta.env.DEV) {
    return updateVisitSignatureStateDev(visitUuid, signatureState);
  }

  const updateData: MDB_IUpdateVisitSignatureStateInput = {
    registration_signature_status: signatureState,
  };
  const { data } = await mafildbApi.patch<MDB_UpdateVisitSignatureStateResponse>(`visits/${visitUuid}`, updateData);

  if (MDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.registration_signature_status;
};
