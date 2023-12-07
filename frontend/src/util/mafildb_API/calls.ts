import { subDays } from "date-fns";
import axiosConfig from "@app/axios-config";
import { IDevice } from "@app/model/device";
import { ValidatedFormData } from "@app/model/form";
import { IProject } from "@app/model/project";
import {
  IDuplicatedVisitIncludingQuestions,
  IRecentVisitsTableVisit,
  IVisitDetail,
  ProbandVisitLanguageCode,
} from "@app/model/visit";
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
  updateVisitStateDev,
} from "./calls.dev";
import {
  IAddPdfToVisitInput,
  ICreateSubjectInput,
  ICreateVisitInput,
  ISubjectDTO,
  IUpdateVisitStateInput,
  IVisitDTO,
  IVisitFileDTO,
  VisitFileType,
  VisitState,
} from "./dto";
import {
  AddPdfToVisitResponse,
  CreateSubjectResponse,
  CreateVisitResponse,
  DevicesResponse,
  MAFILDB_RESPONSE_ERROR_ATTR,
  ProjectsResponse,
  UpdateVisitStateResponse,
  VisitFilesResponse,
  VisitResponse,
  VisitsResponse,
} from "./response-types";

export const fetchProjects = async (): Promise<IProject[]> => {
  if (import.meta.env.DEV) {
    return fetchProjectsDev();
  }

  const { data } = await axiosConfig.mafildbApi.get<ProjectsResponse>("v2/projects");

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.results.map((projectDTO) => ({ ...projectDTO }));
};

export const fetchDevices = async (): Promise<IDevice[]> => {
  if (import.meta.env.DEV) {
    return fetchDevicesDev();
  }

  const { data } = await axiosConfig.mafildbApi.get<DevicesResponse>("v2/devices");

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data.results.map((deviceDTO) => ({ ...deviceDTO }));
};

const createVisitSubject = async (
  visitFormData: ValidatedFormData,
  probandLanguageCode?: ProbandVisitLanguageCode
): Promise<ISubjectDTO | never> => {
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

  return data;
};

const createVisit = async (
  visitFormData: ValidatedFormData,
  state: VisitState,
  isPhantom: boolean,
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode?: ProbandVisitLanguageCode,
  approverUsername?: string,
  approvedAt?: Date
): Promise<string | never> => {
  if (finalizerUsername === undefined) {
    throw new Error("Missing username of the operator who finalized the visit!");
  }

  if (finalizedAt === undefined) {
    throw new Error("Missing visit finalization date!");
  }

  if (import.meta.env.DEV) {
    return createVisitDev(visitFormData, state, isPhantom, finalizerUsername, probandLanguageCode);
  }

  const subject = await createVisitSubject(visitFormData);
  const createData: ICreateVisitInput = {
    state,
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
    registration_finalize_user: finalizerUsername,
    registration_finalize_date: finalizedAt,
    registration_approve_user: approverUsername ?? "",
    registration_approve_date: approvedAt,
    registration_disapprove_reason: visitFormData.disapprovalReason,
  };
  const { data } = await axiosConfig.mafildbApi.post<CreateVisitResponse>("v2/visits", createData);
  return data.visit_name;
};

export const createFinalizedVisit = async (
  visitFormData: ValidatedFormData,
  state: VisitState,
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode: ProbandVisitLanguageCode | undefined
): Promise<string | never> => {
  if (probandLanguageCode === undefined) {
    throw new Error("Missing proband language code!");
  }

  return createVisit(visitFormData, state, false, finalizerUsername, finalizedAt, probandLanguageCode);
};

export const createVisitFromApproval = async (
  visitFormData: ValidatedFormData,
  state: VisitState,
  finalizerUsername: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode: ProbandVisitLanguageCode | undefined,
  approverUsername: string | undefined,
  approvedAt: Date | undefined
): Promise<string | never> => {
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
): Promise<string | never> => createVisit(visitFormData, VisitState.APPROVED, true, finalizerUsername, finalizedAt);

export const addPdfToVisit = async (visitId: string, pdf: IPdfDTO): Promise<void> => {
  if (import.meta.env.DEV) {
    return addPdfToVisitDev();
  }

  const addPdfToVisitData: IAddPdfToVisitInput = {
    file_type: "reg_form",
    name: pdf.name,
    mime_type: "application/pdf",
    content: pdf.content,
  };
  await axiosConfig.mafildbApi.post<AddPdfToVisitResponse>(`v2/visits/${visitId}/files`, addPdfToVisitData);
  return undefined;
};

export const fetchRecentVisits = async (): Promise<IRecentVisitsTableVisit[]> => {
  if (import.meta.env.DEV) {
    return fetchRecentVisitsDev();
  }

  // Fetch only visits created 3 days ago and newer
  const params = { newer_than: subDays(new Date().setHours(0, 0, 0, 0), 3).valueOf() };
  const { data } = await axiosConfig.mafildbApi.get<VisitsResponse>("v2/visits", { params });

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  const visits: IRecentVisitsTableVisit[] = [];
  data.results.forEach(async (visit) => {
    let finalizer: IOperatorDTO | undefined;

    try {
      finalizer = await fetchOperator(visit.registration_finalize_user);

      if (finalizer === undefined) {
        throw new Error("Finalizer not found!");
      }
    } catch (e) {
      // TODO: what to do when finalizer not found? Skip the visit?
      return;
    }

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

const fetchVisit = async (visitId: string): Promise<IVisitDTO | never> => {
  const { data } = await axiosConfig.mafildbApi.get<VisitResponse>(`v2/visits/${visitId}`);

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  return data;
};

export const fetchDuplicatedVisit = async (
  visitId: string | undefined
): Promise<IDuplicatedVisitIncludingQuestions | never> => {
  if (visitId === undefined) {
    throw new Error("Missing visit ID!");
  }

  if (import.meta.env.DEV) {
    return fetchDuplicatedVisitDev(visitId);
  }

  const visit = await fetchVisit(visitId);
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

const fetchVisitPDF = async (visitId: string): Promise<IVisitFileDTO> => {
  type VisitFilesParams = {
    file_type: VisitFileType;
  };
  const params: VisitFilesParams = { file_type: "reg_form" };
  const { data } = await axiosConfig.mafildbApi.get<VisitFilesResponse>(`v2/visits/${visitId}/files`, { params });

  if (MAFILDB_RESPONSE_ERROR_ATTR in data) {
    throw new Error(data.detail);
  }

  const pdf = data.results.find((file) => file.file_type.includes("reg_form"));

  if (pdf === undefined) {
    throw new Error("Visit PDF not provided!");
  }

  return pdf;
};

export const fetchVisitDetail = async (visitId: string | undefined): Promise<IVisitDetail | never> => {
  if (visitId === undefined) {
    throw new Error("Missing visit ID!");
  }

  if (import.meta.env.DEV) {
    return fetchVisitDetailDev(visitId);
  }

  const [visit, visitPDF] = await Promise.all([fetchVisit(visitId), fetchVisitPDF(visitId)]);
  return {
    visitId: visit.visit_name,
    isPhantom: visit.is_phantom,
    state: visit.state,
    pdf: {
      name: visitPDF.name,
      content: visitPDF.content,
    },
  };
};

export const updateVisitSignatureState = async (visitId: string, state: VisitState): Promise<string | never> => {
  if (import.meta.env.DEV) {
    return updateVisitStateDev(visitId, state);
  }

  const updateData: IUpdateVisitStateInput = {
    visit_name: visitId,
    state,
  };
  const { data } = await axiosConfig.mafildbApi.patch<UpdateVisitStateResponse>(`v2/visits/${visitId}`, updateData);
  return data.visit_name;
};
