import axiosConfig from "@app/axios-config";
import { ValidatedFormData } from "@app/model/form";
import {
  IDuplicatedVisitIncludingQuestions,
  IRecentVisitsTableVisit,
  IVisitDetail,
  ProbandVisitLanguageCode,
} from "@app/model/visit";
import { devicesDev, dummyVisits, generateVisitId, PDF_CONTENT, projectsDev } from "@app/util/mafildb_API/data.dev";
import { fetchGender, fetchHandedness, fetchNativeLanguage, fetchOperator, fetchQuestion } from "../server_API/calls";
import { IOperatorDTO, IPdfDTO, VisitFormAnswerIncludingQuestion } from "../server_API/dto";
import {
  IAddPdfToVisitInput,
  ICreateVisitInput,
  IDeviceDTO,
  IProjectDTO,
  IUpdateVisitStateInput,
  IVisitDTO,
  IVisitPdfDTO,
  VisitState,
} from "./dto";
import {
  AddPdfToVisitResponse,
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

  // TODO: add correct MAFILDB endpoint
  const { data } = await axiosConfig.mafildbApi.get<ProjectsResponse>("projects.json");
  return data.rows;
};

export const fetchDevices = async (): Promise<IDeviceDTO[]> => {
  if (import.meta.env.DEV) {
    return devicesDev;
  }

  // TODO: add correct MAFILDB endpoint
  const { data } = await axiosConfig.mafildbApi.get<DevicesResponse>("devices.json");
  return data.rows;
};

const createVisit = async (
  visitFormData: ValidatedFormData,
  state: VisitState,
  finalizerUco: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode?: ProbandVisitLanguageCode,
  approverUco?: string,
  approvedAt?: Date
): Promise<string | never> => {
  if (finalizerUco === undefined) {
    throw new Error("Missing UCO of the operator who finalized the visit!");
  }

  if (finalizedAt === undefined) {
    throw new Error("Missing visit finalization date!");
  }

  if (import.meta.env.DEV) {
    dummyVisits.push({
      ...visitFormData,
      state,
      visit_name: generateVisitId(),
      date: new Date(),
      is_phantom: state === VisitState.PHANTOM_DONE,
      proband_language_code: probandLanguageCode ?? "",
      finalizer_uco: finalizerUco,
      measurement_date: visitFormData.measuredAt ?? new Date(),
      project_id: visitFormData.project?.id ?? "",
      device_id: visitFormData.device?.id ?? "",
      personal_id: visitFormData.personalId,
      birthdate: visitFormData.birthdate,
      gender_code: visitFormData.gender.code,
      native_language_code: visitFormData.nativeLanguage.code,
      height_cm: visitFormData.heightCm,
      weight_kg: visitFormData.weightKg,
      visual_correction_dioptre: visitFormData.visualCorrectionDioptre,
      handedness_code: visitFormData.handedness.code,
      answers: visitFormData.answers.map((answer) => ({
        question_id: answer.questionId,
        answer: answer.answer,
        comment: answer.comment,
      })),
    });
    return dummyVisits[dummyVisits.length - 1].visit_name;
  }

  const createData: ICreateVisitInput = {
    state,
    is_phantom: state === VisitState.PHANTOM_DONE,
    proband_language_code: probandLanguageCode ?? "",
    project_id: visitFormData.project?.id ?? "",
    device_id: visitFormData.device?.id ?? "",
    measurement_date: visitFormData.measuredAt ?? new Date(),
    name: visitFormData.name,
    surname: visitFormData.surname,
    personal_id: visitFormData.personalId,
    birthdate: visitFormData.birthdate,
    gender_code: visitFormData.gender.code,
    native_language_code: visitFormData.nativeLanguage.code,
    height_cm: visitFormData.heightCm,
    weight_kg: visitFormData.weightKg,
    handedness_code: visitFormData.handedness.code,
    visual_correction_dioptre: visitFormData.visualCorrectionDioptre,
    email: visitFormData.email,
    phone: visitFormData.phone,
    answers: visitFormData.answers.map((answer) => ({
      question_id: answer.questionId,
      answer: answer.answer,
      comment: answer.comment,
    })),
    finalizer_uco: finalizerUco,
    finalization_date: finalizedAt,
    approver_uco: approverUco ?? "",
    approval_date: approvedAt,
    disapproval_reason: visitFormData.disapprovalReason,
  };
  // TODO: add correct MAFILDB endpoint
  const { data } = await axiosConfig.mafildbApi.post<CreateVisitResponse>("visit", createData);
  return data.visit_name;
};

export const createFinalizedVisit = async (
  visitFormData: ValidatedFormData,
  state: VisitState,
  finalizerUco: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode: ProbandVisitLanguageCode | undefined
): Promise<string | never> => {
  if (probandLanguageCode === undefined) {
    throw new Error("Missing proband language code!");
  }

  return createVisit(visitFormData, state, finalizerUco, finalizedAt, probandLanguageCode);
};

export const createVisitFromApproval = async (
  visitFormData: ValidatedFormData,
  state: VisitState,
  finalizerUco: string | undefined,
  finalizedAt: Date | undefined,
  probandLanguageCode: ProbandVisitLanguageCode | undefined,
  approverUco: string | undefined,
  approvedAt: Date | undefined
): Promise<string | never> => {
  if (probandLanguageCode === undefined) {
    throw new Error("Missing proband language code!");
  }

  if (approverUco === undefined) {
    throw new Error("Proband language code is undefined!");
  }

  if (approvedAt === undefined) {
    throw new Error("Proband language code is undefined!");
  }

  return createVisit(visitFormData, state, finalizerUco, finalizedAt, probandLanguageCode, approverUco, approvedAt);
};

export const createPhantomVisit = async (
  visitFormData: ValidatedFormData,
  finalizerUco: string | undefined,
  finalizedAt: Date | undefined
): Promise<string | never> => createVisit(visitFormData, VisitState.PHANTOM_DONE, finalizerUco, finalizedAt);

export const addPdfToVisit = async (visitId: string, pdf: IPdfDTO): Promise<string> => {
  if (import.meta.env.DEV) {
    return "file_ID";
  }

  const addPdfToVisitData: IAddPdfToVisitInput = {
    visit_name: visitId,
    file_type: "REGISTRATION_PDF",
    file_name: pdf.name,
    file_extension: pdf.extension,
    file_content: pdf.content,
  };
  // TODO: add correct MAFILDB endpoint
  const { data } = await axiosConfig.mafildbApi.post<AddPdfToVisitResponse>("files", addPdfToVisitData);
  return data.file_id;
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
          answers: visit.answers.map((answer) => ({
            questionId: answer.question_id,
            answer: answer.answer,
            comment: answer.comment,
          })),
        });
      }
    });
    return visits;
  }

  const [{ data }, projects, devices] = await Promise.all([
    // TODO: add correct MAFILDB endpoint
    axiosConfig.mafildbApi.get<VisitsResponse>("visits.json"),
    fetchProjects(),
    fetchDevices(),
  ]);
  const visits: IRecentVisitsTableVisit[] = [];
  data.rows.forEach(async (visit) => {
    const project = projects.find((proj) => proj.id === visit.project_id);
    const device = devices.find((dev) => dev.id === visit.device_id);
    let finalizer: IOperatorDTO | undefined;

    try {
      finalizer = await fetchOperator(visit.finalizer_uco);
    } catch (e) {
      // TODO: what to do when finalizer not found? Skip the visit?
    }

    // if project or device don't exist we skip the visit
    if (project !== undefined && device !== undefined && finalizer !== undefined) {
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

const fetchVisit = async (visitId: string): Promise<IVisitDTO | never> => {
  const params = {
    filter: { visit_name: visitId },
  };
  // TODO: add correct MAFILDB endpoint
  const { data } = await axiosConfig.mafildbApi.get<VisitsResponse>("visits.json", { params });

  if (data.rows.length !== 1) {
    throw new Error("Visit not found!");
  }

  return data.rows[0];
};

export const fetchDuplicatedVisit = async (
  visitId: string | undefined
): Promise<IDuplicatedVisitIncludingQuestions | never> => {
  if (visitId === undefined) {
    throw new Error("Missing visit ID!");
  }

  if (import.meta.env.DEV) {
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
        return {
          answer: answer.answer,
          comment: answer.comment,
          questionId: question.id,
          mustBeApproved: question.mustBeApproved,
          partNumber: question.partNumber,
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
  // TODO: correct the MAFILDB endpoint and response object type
  const { data } = await axiosConfig.mafildbApi.get<VisitPdfResponse>("files.json", { params });
  return data.file;
};

export const fetchVisitDetail = async (visitId: string | undefined): Promise<IVisitDetail | never> => {
  if (visitId === undefined) {
    throw new Error("Missing visit ID!");
  }

  if (import.meta.env.DEV) {
    const visit = dummyVisits.find((dummyVisit) => dummyVisit.visit_name === visitId);

    if (visit === undefined) {
      throw new Error("Visit not found!");
    }

    return {
      visitId: visit.visit_name,
      isPhantom: visit.is_phantom,
      state: visit.state,
      pdfName: `${visit.visit_name}.pdf`,
      pdfContent: PDF_CONTENT,
    };
  }

  const [visit, visitPDF] = await Promise.all([fetchVisit(visitId), fetchVisitPDF(visitId)]);
  return {
    visitId: visit.visit_name,
    isPhantom: visit.is_phantom,
    state: visit.state,
    pdfName: `${visitPDF.file_name}.pdf`,
    pdfContent: visitPDF.file_content,
  };
};

export const updateVisitState = async (visitId: string, state: VisitState): Promise<string | never> => {
  if (import.meta.env.DEV) {
    const visit = dummyVisits.find((dummyVisit) => dummyVisit.visit_name === visitId);

    if (visit === undefined) {
      throw new Error("Visit not found!");
    }

    visit.state = state;
    return visit.visit_name;
  }

  const updateData: IUpdateVisitStateInput = {
    visit_name: visitId,
    state,
  };
  // TODO: add correct MAFILDB endpoint
  const { data } = await axiosConfig.mafildbApi.patch<UpdateVisitStateResponse>("visit", updateData);
  return data.visit_name;
};
