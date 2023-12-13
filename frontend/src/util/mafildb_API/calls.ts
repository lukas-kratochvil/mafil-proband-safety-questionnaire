import { subDays } from "date-fns";
import axiosConfig from "@app/axios-config";
import { IDevice } from "@app/model/device";
import { ValidatedFormData } from "@app/model/form";
import { IProject } from "@app/model/project";
import { ISubject } from "@app/model/subject";
import {
  CreateVisit,
  IDuplicatedVisitIncludingQuestions,
  IRecentVisitsTableVisit,
  IVisitDetail,
  ProbandVisitLanguageCode,
} from "@app/model/visit";
import { IVisitPDF } from "@app/model/visitPdf";
import { fetchGender, fetchHandedness, fetchNativeLanguage, fetchOperator, fetchQuestion } from "../server_API/calls";
import { IOperatorDTO, IPdfDTO, VisitFormAnswerIncludingQuestion } from "../server_API/dto";
import {
  addPdfToVisitDev,
  createVisitDev,
  fetchDevicesDev,
  fetchDuplicatedVisitDev,
  fetchProjectsDev,
  fetchRecentVisitsDev,
  fetchVisitDetailDev,
  updateVisitSignatureStateDev,
} from "./calls.dev";
import {
  ApprovalState,
  IAddPdfToVisitInput,
  ICreateSubjectInput,
  ICreateVisitInput,
  IUpdateVisitSignatureStateInput,
  IVisitDTO,
  IVisitFileDTO,
  SignatureState,
  VisitFileType,
} from "./dto";
import {
  AddPdfToVisitResponse,
  CreateSubjectResponse,
  CreateVisitResponse,
  GetDevicesResponse,
  GetProjectsResponse,
  GetVisitFilesResponse,
  GetVisitResponse,
  GetVisitsResponse,
  MAFILDB_RESPONSE_ERROR_ATTR,
  UpdateVisitSignatureStateResponse,
} from "./response-types";

export const fetchProjects = async (): Promise<IProject[]> => {
  if (import.meta.env.DEV) {
    return fetchProjectsDev();
  }

  const { data } = await axiosConfig.mafildbApi.get<GetProjectsResponse>("v2/projects");

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.results.map((projectDTO) => ({ ...projectDTO }));
};

export const fetchDevices = async (): Promise<IDevice[]> => {
  if (import.meta.env.DEV) {
    return fetchDevicesDev();
  }

  // Only MR devices are relevant for this app
  const params = { type: "MR" };
  const { data } = await axiosConfig.mafildbApi.get<GetDevicesResponse>("v2/devices", { params });

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.results.map((deviceDTO) => ({ ...deviceDTO }));
};

const createVisitSubject = async (
  visitFormData: ValidatedFormData,
  probandLanguageCode?: ProbandVisitLanguageCode
): Promise<ISubject | never> => {
  const createData: ICreateSubjectInput = {
    first_name: visitFormData.name,
    last_name: visitFormData.surname,
    preferred_language_id: probandLanguageCode ?? "",
    birth_date: visitFormData.birthdate,
    personal_ID: visitFormData.personalId,
    gender: visitFormData.gender.code,
    native_language_id: visitFormData.nativeLanguage.code,
    handedness: visitFormData.handedness.code,
    email: visitFormData.email,
    phone: visitFormData.phone,
  };
  const { data } = await axiosConfig.mafildbApi.post<CreateSubjectResponse>("v2/subjects", createData);

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return {
    ...data,
    preferredLanguageCode: data.preferred_language_id,
    name: data.first_name,
    surname: data.last_name,
    birthdate: data.birth_date,
    personalId: data.personal_ID,
    genderCode: data.gender,
    nativeLanguageCode: data.native_language_id,
    handednessCode: data.handedness,
  };
};

const createVisit = async (
  visitFormData: ValidatedFormData,
  approvalState: ApprovalState,
  isPhantom: boolean,
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode?: ProbandVisitLanguageCode,
  approverUsername?: string,
  approvedAt?: Date
): Promise<CreateVisit | never> => {
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

  const subject = await createVisitSubject(visitFormData, probandLanguageCode);
  const createData: ICreateVisitInput = {
    checked: approvalState,
    is_phantom: isPhantom,
    subject_uuid: subject.uuid,
    project_uuid: visitFormData.project?.uuid ?? "",
    device_id: visitFormData.device?.id ?? 0,
    date: visitFormData.measuredAt ?? new Date(),
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
  const { data } = await axiosConfig.mafildbApi.post<CreateVisitResponse>("v2/visits", createData);

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return {
    uuid: data.uuid,
    visitId: data.visit_name,
  };
};

export const createFinalizedVisit = async (
  visitFormData: ValidatedFormData,
  approvalState: ApprovalState,
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode: ProbandVisitLanguageCode | undefined
): Promise<CreateVisit | never> => {
  if (probandLanguageCode === undefined) {
    throw new Error("Missing proband language code!");
  }

  return createVisit(visitFormData, approvalState, false, finalizerUsername, finalizedAt, probandLanguageCode);
};

export const createVisitFromApproval = async (
  visitFormData: ValidatedFormData,
  state: ApprovalState,
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode: ProbandVisitLanguageCode | undefined,
  approverUsername: string | undefined,
  approvedAt: Date | undefined
): Promise<CreateVisit | never> => {
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
  visitFormData: ValidatedFormData,
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined
): Promise<CreateVisit | never> =>
  createVisit(visitFormData, ApprovalState.APPROVED, true, finalizerUsername, finalizedAt);

export const addPdfToVisit = async (visitUuid: string, pdf: IPdfDTO): Promise<IVisitPDF> => {
  if (import.meta.env.DEV) {
    return addPdfToVisitDev(pdf);
  }

  const addPdfToVisitData: IAddPdfToVisitInput = {
    file_type: "reg_form",
    name: pdf.name,
    mime_type: "application/pdf",
    content: pdf.content,
  };
  const { data } = await axiosConfig.mafildbApi.post<AddPdfToVisitResponse>(
    `v2/visits/${visitUuid}/files`,
    addPdfToVisitData
  );

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
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

  // Fetch only visits created 3 days ago and newer
  const params = { newer_than: subDays(new Date().setHours(0, 0, 0, 0), 3).valueOf() };
  const { data } = await axiosConfig.mafildbApi.get<GetVisitsResponse>("v2/visits", { params });

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  const visits: IRecentVisitsTableVisit[] = [];
  data.results.forEach(async (visit) => {
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
        preferredLanguageCode: visit.subject.preferred_language_id,
        name: visit.subject.first_name,
        surname: visit.subject.last_name,
        birthdate: visit.subject.birth_date,
        personalId: visit.subject.personal_ID,
        genderCode: visit.subject.gender,
        nativeLanguageCode: visit.subject.native_language_id,
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

const fetchVisit = async (visitUuid: string): Promise<IVisitDTO | never> => {
  const { data } = await axiosConfig.mafildbApi.get<GetVisitResponse>(`v2/visits/${visitUuid}`);

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
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
    subject: {
      ...visit.subject,
      preferredLanguageCode: visit.subject.preferred_language_id,
      name: visit.subject.first_name,
      surname: visit.subject.last_name,
      birthdate: visit.subject.birth_date,
      personalId: visit.subject.personal_ID,
      genderCode: visit.subject.gender,
      nativeLanguageCode: visit.subject.native_language_id,
      handednessCode: visit.subject.handedness,
    },
  };
};

const fetchVisitPDF = async (visitUuid: string): Promise<IVisitFileDTO> => {
  type VisitFilesParams = {
    file_type: VisitFileType;
  };
  const params: VisitFilesParams = { file_type: "reg_form" };
  const { data } = await axiosConfig.mafildbApi.get<GetVisitFilesResponse>(`v2/visits/${visitUuid}/files`, { params });

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
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
  signatureState: SignatureState
): Promise<string | never> => {
  if (import.meta.env.DEV) {
    return updateVisitSignatureStateDev(visitUuid, signatureState);
  }

  const updateData: IUpdateVisitSignatureStateInput = {
    registration_signature_status: signatureState,
  };
  const { data } = await axiosConfig.mafildbApi.patch<UpdateVisitSignatureStateResponse>(
    `v2/visits/${visitUuid}`,
    updateData
  );

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.registration_signature_status;
};
