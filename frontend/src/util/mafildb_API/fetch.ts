import axiosConfig from "@app/axios-config";
import { LanguageCode } from "@app/i18n";
import { AnswerOption, FormPropType } from "@app/model/form";
import { IDuplicatedVisitIncludingQuestions, IRecentVisitsTableVisit, IVisitDetail } from "@app/model/visit";
import { devicesDev, dummyVisits, generateVisitId, projectsDev } from "@app/util/mafildb_API/data.dev";
import { VisitFormAnswerIncludingQuestion } from "../server_API/dto";
import { fetchGender, fetchHandedness, fetchNativeLanguage, fetchOperator, fetchQuestion } from "../server_API/fetch";
import { IDeviceDTO, IProjectDTO, IVisitDTO, IVisitPdfDTO, VisitState } from "./dto";
import {
  CreateVisitResponse,
  DevicesResponse,
  ProjectsResponse,
  UpdateVisitStateResponse,
  VisitPdfResponse,
  VisitsResponse,
} from "./response-types";

const PDF_FILE_TYPE = "REGISTRATION_PDF";

export const fetchProjects = async (): Promise<IProjectDTO[]> => {
  if (import.meta.env.DEV) {
    return projectsDev;
  }

  const { data } = await axiosConfig.mafildbApi.get<ProjectsResponse>("projects.json");
  return data.rows;
};

export const fetchDevices = async (): Promise<IDeviceDTO[]> => {
  if (import.meta.env.DEV) {
    return devicesDev;
  }

  const { data } = await axiosConfig.mafildbApi.get<DevicesResponse>("devices.json");
  return data.rows;
};

export const fetchRecentVisits = async (): Promise<IRecentVisitsTableVisit[]> => {
  if (import.meta.env.DEV) {
    const [projects, devices, finalizer] = await Promise.all([
      fetchProjects(),
      fetchDevices(),
      fetchOperator(dummyVisits[0].finalizer_uco),
    ]);
    const visits: IRecentVisitsTableVisit[] = [];
    dummyVisits.forEach((visit) => {
      const project = projects.find((proj) => proj.id === visit.project_id);
      const device = devices.find((dev) => dev.id === visit.device_id);

      // if project or device don't exist we skip the visit
      if (project !== undefined && device !== undefined) {
        visits.push({
          ...visit,
          visitId: visit.visit_name,
          isPhantom: visit.is_phantom,
          project,
          device,
          measurementDate: visit.measurement_date,
          finalizer,
          probandLanguageCode: visit.proband_language_code,
          personalId: visit.personal_id,
          heightCm: visit.height_cm,
          weightKg: visit.weight_kg,
          visualCorrectionDioptre: visit.visual_correction_dioptre,
          answers: visit.answers.map((answer) => ({ ...answer, questionId: answer.question_id })),
        });
      }
    });
    return visits;
  }

  const [{ data }, projects, devices] = await Promise.all([
    axiosConfig.mafildbApi.get<VisitsResponse>("visits.json"),
    fetchProjects(),
    fetchDevices(),
  ]);
  const visits: IRecentVisitsTableVisit[] = [];
  data.rows.forEach(async (visit) => {
    const project = projects.find((proj) => proj.id === visit.project_id);
    const device = devices.find((dev) => dev.id === visit.device_id);
    const finalizer = await fetchOperator(visit.finalizer_uco);

    // if project or device don't exist we skip the visit
    if (project !== undefined && device !== undefined) {
      visits.push({
        ...visit,
        visitId: visit.visit_name,
        isPhantom: visit.is_phantom,
        project,
        device,
        measurementDate: visit.measurement_date,
        finalizer,
        probandLanguageCode: visit.proband_language_code,
        personalId: visit.personal_id,
        heightCm: visit.height_cm,
        weightKg: visit.weight_kg,
        visualCorrectionDioptre: visit.visual_correction_dioptre,
        answers: visit.answers.map((answer) => ({ ...answer, questionId: answer.question_id })),
      });
    }
  });
  return visits;
};

const fetchVisit = async (visitId: string | undefined): Promise<IVisitDTO | never> => {
  const params = {
    filter: { visit_name: visitId },
  };
  const { data } = await axiosConfig.mafildbApi.get<VisitsResponse>("visits.json", { params });

  if (data.rows.length !== 1) {
    // TODO: translate error message
    throw new Error("Visit not found!");
  }

  return data.rows[0];
};

export const fetchDuplicatedVisit = async (
  visitId: string | undefined
): Promise<IDuplicatedVisitIncludingQuestions | undefined> => {
  if (import.meta.env.DEV) {
    const visit = dummyVisits.find((dummyVisit) => dummyVisit.visit_name === visitId);

    if (visit === undefined) {
      return undefined;
    }

    const [gender, nativeLanguage, handedness, answersIncludingQuestions] = await Promise.all([
      fetchGender(visit.gender_code),
      fetchNativeLanguage(visit.native_language_code),
      fetchHandedness(visit.handedness_code),
      Promise.all(
        visit.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
          const question = await fetchQuestion(answer.question_id);
          return { ...question, questionId: question.id, answer: answer.answer, comment: answer.comment };
        })
      ),
    ]);
    return {
      ...visit,
      visitId: visit.visit_name,
      isPhantom: visit.is_phantom,
      measurementDate: visit.measurement_date,
      probandLanguageCode: visit.proband_language_code,
      personalId: visit.personal_id,
      gender,
      nativeLanguage,
      heightCm: visit.height_cm,
      weightKg: visit.weight_kg,
      visualCorrectionDioptre: visit.visual_correction_dioptre,
      handedness,
      answersIncludingQuestions,
    };
  }

  const visit = await fetchVisit(visitId);
  const [gender, nativeLanguage, handedness, answersIncludingQuestions] = await Promise.all([
    fetchGender(visit.gender_code),
    fetchNativeLanguage(visit.native_language_code),
    fetchHandedness(visit.handedness_code),
    Promise.all(
      visit.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
        const question = await fetchQuestion(answer.question_id);
        return { ...question, questionId: question.id, answer: answer.answer, comment: answer.comment };
      })
    ),
  ]);
  return {
    ...visit,
    visitId: visit.visit_name,
    isPhantom: visit.is_phantom,
    measurementDate: visit.measurement_date,
    probandLanguageCode: visit.proband_language_code,
    personalId: visit.personal_id,
    gender,
    nativeLanguage,
    heightCm: visit.height_cm,
    weightKg: visit.weight_kg,
    visualCorrectionDioptre: visit.visual_correction_dioptre,
    handedness,
    answersIncludingQuestions,
  };
};

const fetchVisitPDF = async (visitId: string): Promise<IVisitPdfDTO> => {
  const params = {
    filter: {
      visit_name: visitId,
      file_type: PDF_FILE_TYPE,
    },
  };
  // TODO: correct the endpoint and response object type
  const { data } = await axiosConfig.mafildbApi.get<VisitPdfResponse>("files.json", { params });
  return data.file;
};

export const fetchVisitDetail = async (visitId: string | undefined): Promise<IVisitDetail | undefined> => {
  if (visitId === undefined) {
    return undefined;
  }

  if (import.meta.env.DEV) {
    const visit = dummyVisits.find((dummyVisit) => dummyVisit.visit_name === visitId);

    if (visit === undefined) {
      throw new Error("Visit not found!");
    }

    return {
      ...visit,
      visitId: visit.visit_name,
      isPhantom: visit.is_phantom,
      pdfContent: "",
    };
  }

  const [visit, visitPDF] = await Promise.all([fetchVisit(visitId), fetchVisitPDF(visitId)]);
  return {
    ...visit,
    visitId: visit.visit_name,
    isPhantom: visit.is_phantom,
    pdfContent: visitPDF.file_content,
  };
};

export const createVisit = async (
  visitFormData: FormPropType,
  state: VisitState,
  finalizerUco: string | undefined,
  finalizedAt: Date,
  probandLanguageCode?: LanguageCode,
  approverUco?: string,
  approvedAt?: Date
): Promise<string | undefined> => {
  if (finalizerUco === undefined) {
    throw new Error("Missing UCO of the operator who finalized the visit!");
  }

  if (import.meta.env.DEV) {
    dummyVisits.push({
      ...visitFormData,
      state,
      visit_name: generateVisitId(),
      date: new Date(),
      is_phantom: state === VisitState.PHANTOM_DONE,
      proband_language_code: probandLanguageCode || "cs",
      finalizer_uco: finalizerUco || "",
      measurement_date: visitFormData.measuredAt || new Date(),
      project_id: visitFormData.project?.id || "",
      device_id: visitFormData.device?.id || "",
      personal_id: visitFormData.personalId,
      birthdate: visitFormData.birthdate ?? new Date(),
      gender_code: visitFormData.gender?.code || "",
      native_language_code: visitFormData.nativeLanguage?.code || "",
      height_cm: typeof visitFormData.heightCm === "string" ? +visitFormData.heightCm : visitFormData.heightCm,
      weight_kg: typeof visitFormData.weightKg === "string" ? +visitFormData.weightKg : visitFormData.weightKg,
      visual_correction_dioptre:
        typeof visitFormData.visualCorrectionDioptre === "string"
          ? +visitFormData.visualCorrectionDioptre
          : visitFormData.visualCorrectionDioptre,
      handedness_code: visitFormData.handedness?.code || "",
      answers: visitFormData.answers.map((answer) => ({
        question_id: answer.questionId,
        answer: answer.answer ?? AnswerOption.NO,
        comment: answer.comment,
      })),
    });
    return undefined;
  }

  const createData = {
    state,
    is_phantom: state === VisitState.PHANTOM_DONE,
    proband_language_code: probandLanguageCode,
    project_id: visitFormData.project?.id,
    device_id: visitFormData.device?.id,
    measurement_date: visitFormData.measuredAt,
    name: visitFormData.name,
    surname: visitFormData.surname,
    personal_id: visitFormData.personalId,
    birthdate: visitFormData.birthdate,
    gender_code: visitFormData.gender?.code,
    native_language_code: visitFormData.nativeLanguage?.code,
    height_cm: visitFormData.heightCm,
    weight_kg: visitFormData.weightKg,
    handedness_code: visitFormData.handedness?.code,
    visual_correction_dioptre: visitFormData.visualCorrectionDioptre,
    email: visitFormData.email,
    phone: visitFormData.phone,
    answers: visitFormData.answers.map((answer) => ({
      question_id: answer.questionId,
      answer: answer.answer,
      comment: answer.comment,
    })),
    disapproval_reason: visitFormData.disapprovalReason,
    finalizer_uco: finalizerUco,
    finalization_date: finalizedAt,
    approver_uco: approverUco,
    approval_date: approvedAt,
  };
  const { data } = await axiosConfig.mafildbApi.post<CreateVisitResponse>("visit", createData);
  return data.visit_name;
};

export const updateVisitState = async (visitId: string | undefined, state: VisitState): Promise<string | undefined> => {
  if (import.meta.env.DEV) {
    const visit = dummyVisits.find((dummyVisit) => dummyVisit.visit_name === visitId);

    if (visit === undefined) {
      throw new Error("Visit not found!");
    }

    visit.state = state;
    return visit.visit_name;
  }

  const updateData = {
    visit_name: visitId,
    state,
  };
  const { data } = await axiosConfig.mafildbApi.patch<UpdateVisitStateResponse>("visit", updateData);
  return data.visit_name;
};
