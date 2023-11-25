import { subDays } from "date-fns";
import axiosConfig from "@app/axios-config";
import { ValidatedFormData } from "@app/model/form";
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
  ICreateVisitInput,
  IDeviceDTO,
  IProjectDTO,
  IUpdateVisitStateInput,
  IVisitDTO,
  IVisitFileDTO,
  VisitState,
} from "./dto";
import {
  AddPdfToVisitResponse,
  CreateVisitResponse,
  DevicesResponse,
  ProjectsResponse,
  UpdateVisitStateResponse,
  VisitFilesResponse,
  VisitsResponse,
} from "./response-types";

const PDF_FILE_TYPE = "REGISTRATION_PDF";

export const fetchProjects = async (): Promise<IProjectDTO[]> => {
  if (import.meta.env.DEV) {
    return fetchProjectsDev();
  }

  const { data } = await axiosConfig.mafildbApi.get<ProjectsResponse>("v2/projects");
  return data.results;
};

export const fetchDevices = async (): Promise<IDeviceDTO[]> => {
  if (import.meta.env.DEV) {
    return fetchDevicesDev();
  }

  const { data } = await axiosConfig.mafildbApi.get<DevicesResponse>("v2/devices");
  return data.results;
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

  const createData: ICreateVisitInput = {
    state,
    is_phantom: isPhantom,
    preferred_language_id: probandLanguageCode ?? "",
    project_uuid: visitFormData.project?.uuid ?? "",
    device_id: visitFormData.device?.id ?? "",
    date: visitFormData.measuredAt ?? new Date(),
    name: visitFormData.name,
    surname: visitFormData.surname,
    personal_id: visitFormData.personalId,
    birthdate: visitFormData.birthdate,
    gender_code: visitFormData.gender.code,
    native_language_code: visitFormData.nativeLanguage.code,
    height: visitFormData.heightCm,
    weight: visitFormData.weightKg,
    handedness_code: visitFormData.handedness.code,
    visual_correction_dioptre: visitFormData.visualCorrectionDioptre,
    email: visitFormData.email,
    phone: visitFormData.phone,
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
    file_type: "REGISTRATION_PDF",
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

  const [{ data }, projects, devices] = await Promise.all([
    axiosConfig.mafildbApi.get<VisitsResponse>("v2/visits", { params }),
    fetchProjects(),
    fetchDevices(),
  ]);
  const visits: IRecentVisitsTableVisit[] = [];
  data.results.forEach(async (visit) => {
    const project = projects.find((proj) => proj.uuid === visit.project_uuid);
    const device = devices.find((dev) => dev.id === visit.device_id);
    let finalizer: IOperatorDTO | undefined;

    try {
      finalizer = await fetchOperator(visit.registration_finalize_user);
    } catch (e) {
      // TODO: what to do when finalizer not found? Skip the visit?
      return;
    }

    // if project or device don't exist we skip the visit
    if (project !== undefined && device !== undefined && finalizer !== undefined) {
      visits.push({
        ...visit,
        visitId: visit.visit_name,
        isPhantom: visit.is_phantom,
        project,
        device,
        measurementDate: visit.date,
        finalizer,
        probandLanguageCode: visit.preferred_language_id,
        personalId: visit.personal_id,
        heightCm: visit.height,
        weightKg: visit.weight,
        visualCorrectionDioptre: visit.visual_correction_dioptre,
        answers: visit.registration_answers.map((answer) => ({
          questionId: answer.question_id,
          answer: answer.answer,
          comment: answer.comment,
        })),
      });
    }
  });
  return visits;
};

const fetchVisit = async (visitId: string): Promise<IVisitDTO | never> => {
  const { data } = await axiosConfig.mafildbApi.get<VisitsResponse>(`v2/visits/${visitId}`);

  if (data.results.length !== 1) {
    throw new Error("Visit not found!");
  }

  return data.results[0];
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
    fetchGender(visit.gender_code),
    fetchNativeLanguage(visit.native_language_code),
    fetchHandedness(visit.handedness_code),
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

const fetchVisitPDF = async (visitId: string): Promise<IVisitFileDTO> => {
  const params = { file_type: PDF_FILE_TYPE };
  // TODO: use query filter on file_type
  const { data } = await axiosConfig.mafildbApi.get<VisitFilesResponse>(`v2/visits/${visitId}/files`, { params });
  const pdf = data.files.find((file) => file.file_type.includes("reg_form"));

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
