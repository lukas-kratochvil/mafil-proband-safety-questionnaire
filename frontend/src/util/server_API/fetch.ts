import axiosConfig from "@app/axios-config";
import i18n, { LanguageCode } from "@app/i18n";
import { IOperatorAuthorization } from "@app/model/auth";
import { ValidatedFormData } from "@app/model/form";
import { ProbandVisitLanguageCode } from "@app/model/visit";
import {
  IApprovalRoomTableVisitFormDTO,
  IApprovalRoomVisitFormIncludingQuestionsDTO,
  ICreateDuplicatedVisitFormForApprovalInput,
  ICreateProbandVisitFormInput,
  IGenderDTO,
  IGeneratePdfInput,
  IHandednessDTO,
  IHTMLCardDTO,
  INativeLanguageDTO,
  IOperatorDTO,
  IPdfDTO,
  IQuestionDTO,
  ISendVisitFormFromWaitingRoomForApprovalInput,
  IUpdateVisitFormStateInput,
  IWaitingRoomTableVisitFormDTO,
  IWaitingRoomVisitFormIncludingQuestions,
  VisitFormAnswerIncludingQuestion,
  VisitFormState,
} from "@app/util/server_API/dto";
import { CREATE_VISIT_FORM, DELETE_VISIT_FORM, UPDATE_VISIT_FORM } from "./mutations";
import {
  AUTHENTICATE_OPERATOR,
  GENERATE_PDF,
  GET_APPROVAL_ROOM_TABLE_VISIT_FORMS,
  GET_APPROVAL_ROOM_VISIT_FORM,
  GET_BEFORE_EXAMINATION,
  GET_CURRENT_QUESTIONS,
  GET_ENTRY_INFO,
  GET_EXAMINATION_CONSENT,
  GET_GENDER,
  GET_GENDERS,
  GET_HANDEDNESS,
  GET_HANDEDNESSES,
  GET_NATIVE_LANGUAGE,
  GET_NATIVE_LANGUAGES,
  GET_OPERATOR,
  GET_PROBAND_CONTACT_CONSENT,
  GET_PROBAND_CONTACT_REQUEST,
  GET_QUESTION,
  GET_SAFETY_INFO,
  GET_WAITING_ROOM_TABLE_VISIT_FORMS,
  GET_WAITING_ROOM_VISIT_FORM,
} from "./queries";
import {
  ApprovalRoomTableVisitFormsResponse,
  ApprovalRoomVisitFormResponse,
  AuthenticateOperatorResponse,
  BeforeExaminationResponse,
  CreateVisitFormResponse,
  CurrentQuestionsResponse,
  EntryInfoResponse,
  ExaminationConsentResponse,
  GenderResponse,
  GendersResponse,
  GeneratePdfResponse,
  HandednessesResponse,
  HandednessResponse,
  NativeLanguageResponse,
  NativeLanguagesResponse,
  OperatorResponse,
  ProbandContactConsentResponse,
  ProbandContactRequestResponse,
  QuestionResponse,
  SafetyInfoResponse,
  UpdateVisitFormResponse,
  WaitingRoomTableVisitFormsResponse,
  WaitingRoomVisitFormResponse,
} from "./response-types";

export const authenticateOperator = async (loggingOperator: IOperatorAuthorization): Promise<IOperatorDTO> => {
  const variables: IOperatorAuthorization = { ...loggingOperator };
  const { data } = await axiosConfig.serverApi.post<AuthenticateOperatorResponse>("", {
    query: AUTHENTICATE_OPERATOR,
    variables,
  });
  return data.data.authenticateOperator;
};

export const fetchOperator = async (uco: string): Promise<IOperatorDTO> => {
  const variables = { uco };
  const { data } = await axiosConfig.serverApi.post<OperatorResponse>("", { query: GET_OPERATOR, variables });
  return data.data.operator;
};

export const fetchGenders = async (): Promise<IGenderDTO[]> => {
  const { data } = await axiosConfig.serverApi.post<GendersResponse>("", { query: GET_GENDERS });
  return data.data.genders;
};

export const fetchGender = async (code: string): Promise<IGenderDTO> => {
  const variables = { code };
  const { data } = await axiosConfig.serverApi.post<GenderResponse>("", { query: GET_GENDER, variables });
  return data.data.gender;
};

export const fetchNativeLanguages = async (): Promise<INativeLanguageDTO[]> => {
  const { data } = await axiosConfig.serverApi.post<NativeLanguagesResponse>("", { query: GET_NATIVE_LANGUAGES });
  return data.data.nativeLanguages;
};

export const fetchNativeLanguage = async (code: string): Promise<INativeLanguageDTO> => {
  const variables = { code };
  const { data } = await axiosConfig.serverApi.post<NativeLanguageResponse>("", {
    query: GET_NATIVE_LANGUAGE,
    variables,
  });
  return data.data.nativeLanguage;
};

export const fetchHandednesses = async (): Promise<IHandednessDTO[]> => {
  const { data } = await axiosConfig.serverApi.post<HandednessesResponse>("", { query: GET_HANDEDNESSES });
  return data.data.handednesses;
};

export const fetchHandedness = async (code: string): Promise<IHandednessDTO> => {
  const variables = { code };
  const { data } = await axiosConfig.serverApi.post<HandednessResponse>("", { query: GET_HANDEDNESS, variables });
  return data.data.handedness;
};

export const fetchCurrentQuestions = async (): Promise<IQuestionDTO[]> => {
  const { data } = await axiosConfig.serverApi.post<CurrentQuestionsResponse>("", { query: GET_CURRENT_QUESTIONS });
  return data.data.questions;
};

export const fetchQuestion = async (questionId: string): Promise<IQuestionDTO> => {
  const variables = { id: questionId };
  const { data } = await axiosConfig.serverApi.post<QuestionResponse>("", { query: GET_QUESTION, variables });
  return data.data.question;
};

export const fetchEntryInfo = async (locale: LanguageCode): Promise<IHTMLCardDTO> => {
  const variables = { locale };
  const { data } = await axiosConfig.serverApi.post<EntryInfoResponse>("", {
    query: GET_ENTRY_INFO,
    variables,
  });
  return data.data.entryInfo;
};

export const fetchSafetyInfo = async (locale: LanguageCode): Promise<IHTMLCardDTO> => {
  const variables = { locale };
  const { data } = await axiosConfig.serverApi.post<SafetyInfoResponse>("", {
    query: GET_SAFETY_INFO,
    variables,
  });
  return data.data.safetyInfo;
};

export const fetchBeforeExamination = async (locale: LanguageCode): Promise<IHTMLCardDTO> => {
  const variables = { locale };
  const { data } = await axiosConfig.serverApi.post<BeforeExaminationResponse>("", {
    query: GET_BEFORE_EXAMINATION,
    variables,
  });
  return data.data.beforeExamination;
};

export const fetchExaminationConsent = async (locale: LanguageCode): Promise<IHTMLCardDTO> => {
  const variables = { locale };
  const { data } = await axiosConfig.serverApi.post<ExaminationConsentResponse>("", {
    query: GET_EXAMINATION_CONSENT,
    variables,
  });
  return data.data.examinationConsent;
};

export const fetchProbandContactRequest = async (
  locale: LanguageCode,
  name: string,
  surname: string,
  birthdateStr: string,
  currentDateStr: string
): Promise<IHTMLCardDTO> => {
  const variables = { locale, name, surname, birthdateStr, currentDateStr };
  const { data } = await axiosConfig.serverApi.post<ProbandContactRequestResponse>("", {
    query: GET_PROBAND_CONTACT_REQUEST,
    variables,
  });
  return data.data.probandContactRequest;
};

export const fetchProbandContactConsent = async (locale: LanguageCode): Promise<IHTMLCardDTO> => {
  const variables = { locale };
  const { data } = await axiosConfig.serverApi.post<ProbandContactConsentResponse>("", {
    query: GET_PROBAND_CONTACT_CONSENT,
    variables,
  });
  return data.data.probandContactConsent;
};

export const fetchWaitingRoomTableVisitForms = async (): Promise<IWaitingRoomTableVisitFormDTO[]> => {
  const variables = { state: "NEW" };
  const { data } = await axiosConfig.serverApi.post<WaitingRoomTableVisitFormsResponse>("", {
    query: GET_WAITING_ROOM_TABLE_VISIT_FORMS,
    variables,
  });
  return data.data.visitForms;
};

export const fetchWaitingRoomVisitForm = async (
  visitId: string | undefined
): Promise<IWaitingRoomVisitFormIncludingQuestions | never> => {
  if (visitId === undefined) {
    throw new Error("Missing visit ID!");
  }

  const variables = { id: visitId };
  const { data } = await axiosConfig.serverApi.post<WaitingRoomVisitFormResponse>("", {
    query: GET_WAITING_ROOM_VISIT_FORM,
    variables,
  });
  const { visitForm } = data.data;
  const answersIncludingQuestions = await Promise.all(
    visitForm.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
      const question = await fetchQuestion(answer.questionId);
      return {
        answer: answer.answer,
        comment: "",
        questionId: question.id,
        mustBeApproved: question.mustBeApproved,
        partNumber: question.partNumber,
        hiddenByGenders: question.hiddenByGenders,
        translations: question.translations,
        updatedAt: question.updatedAt,
      };
    })
  );
  return { ...visitForm, probandLanguageCode: visitForm.probandLanguage.code, answersIncludingQuestions };
};

export const fetchApprovalRoomTableVisitForms = async (): Promise<IApprovalRoomTableVisitFormDTO[]> => {
  const variables = { state: "IN_APPROVAL" };
  const { data } = await axiosConfig.serverApi.post<ApprovalRoomTableVisitFormsResponse>("", {
    query: GET_APPROVAL_ROOM_TABLE_VISIT_FORMS,
    variables,
  });
  return data.data.visitForms;
};

export const fetchApprovalRoomVisitForm = async (
  visitId: string | undefined
): Promise<IApprovalRoomVisitFormIncludingQuestionsDTO | never> => {
  if (visitId === undefined) {
    throw new Error("Missing visit ID!");
  }

  const variables = { id: visitId };
  const { data } = await axiosConfig.serverApi.post<ApprovalRoomVisitFormResponse>("", {
    query: GET_APPROVAL_ROOM_VISIT_FORM,
    variables,
  });
  const { visitForm } = data.data;
  const answersIncludingQuestions = await Promise.all(
    visitForm.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
      const question = await fetchQuestion(answer.questionId);
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
  );
  return { ...visitForm, probandLanguageCode: visitForm.probandLanguage.code, answersIncludingQuestions };
};

export const createProbandVisitForm = async (visitFormData: ValidatedFormData): Promise<string> => {
  const variables: ICreateProbandVisitFormInput = {
    createVisitFormInput: {
      probandLanguageCode: i18n.language as LanguageCode,
      name: visitFormData.name,
      surname: visitFormData.surname,
      personalId: visitFormData.personalId,
      birthdate: visitFormData.birthdate,
      genderId: visitFormData.gender.id,
      nativeLanguageId: visitFormData.nativeLanguage.id,
      heightCm: visitFormData.heightCm,
      weightKg: visitFormData.weightKg,
      visualCorrectionDioptre: visitFormData.visualCorrectionDioptre,
      handednessId: visitFormData.handedness.id,
      email: visitFormData.email,
      phone: visitFormData.phone,
      answers: visitFormData.answers.map((answer) => ({
        questionId: answer.questionId,
        answer: answer.answer,
      })),
    },
  };
  const { data } = await axiosConfig.serverApi.post<CreateVisitFormResponse>("", {
    query: CREATE_VISIT_FORM,
    variables,
  });
  return data.data.createVisitForm.id;
};

export const createDuplicatedVisitFormForApproval = async (
  visitFormData: ValidatedFormData,
  finalizerId: string | undefined
): Promise<string> => {
  if (finalizerId === undefined) {
    throw new Error("Missing ID of the operator who finalized the visit!");
  }

  const variables: ICreateDuplicatedVisitFormForApprovalInput = {
    createVisitFormInput: {
      state: "IN_APPROVAL",
      name: visitFormData.name,
      surname: visitFormData.surname,
      personalId: visitFormData.personalId,
      birthdate: visitFormData.birthdate,
      genderId: visitFormData.gender.id,
      nativeLanguageId: visitFormData.nativeLanguage.id,
      heightCm: visitFormData.heightCm,
      weightKg: visitFormData.weightKg,
      visualCorrectionDioptre: visitFormData.visualCorrectionDioptre,
      handednessId: visitFormData.handedness.id,
      email: visitFormData.email,
      phone: visitFormData.phone,
      additionalInfo: {
        projectId: visitFormData.project?.id ?? "",
        projectAcronym: visitFormData.project?.acronym ?? "",
        deviceId: visitFormData.device?.id ?? "",
        deviceName: visitFormData.device?.name ?? "",
        measuredAt: visitFormData.measuredAt ?? new Date(),
        finalizerId,
        finalizedAt: new Date(),
      },
      probandLanguageCode: i18n.language as LanguageCode,
      answers: visitFormData.answers.map((answer) => ({
        questionId: answer.questionId,
        answer: answer.answer,
        comment: answer.comment,
      })),
    },
  };
  const { data } = await axiosConfig.serverApi.post<CreateVisitFormResponse>("", {
    query: CREATE_VISIT_FORM,
    variables,
  });
  return data.data.createVisitForm.id;
};

export const sendVisitFormForApproval = async (
  visitFormId: string,
  visitFormData: Partial<ValidatedFormData>,
  finalizerId: string
): Promise<string> => {
  const variables: ISendVisitFormFromWaitingRoomForApprovalInput = {
    updateVisitFormInput: {
      id: visitFormId,
      state: "IN_APPROVAL",
      name: visitFormData.name === "" ? undefined : visitFormData.name,
      surname: visitFormData.surname === "" ? undefined : visitFormData.surname,
      personalId: visitFormData.personalId === "" ? undefined : visitFormData.personalId,
      birthdate: visitFormData.birthdate,
      genderId: visitFormData.gender?.id ?? undefined,
      nativeLanguageId: visitFormData.nativeLanguage?.id ?? undefined,
      heightCm: visitFormData.heightCm,
      weightKg: visitFormData.weightKg,
      visualCorrectionDioptre: visitFormData.visualCorrectionDioptre,
      handednessId: visitFormData.handedness?.id ?? undefined,
      email: visitFormData.email,
      phone: visitFormData.phone,
      additionalInfo: {
        projectId: visitFormData.project?.id ?? "",
        projectAcronym: visitFormData.project?.acronym ?? "",
        deviceId: visitFormData.device?.id ?? "",
        deviceName: visitFormData.device?.name ?? "",
        measuredAt: visitFormData.measuredAt ?? new Date(),
        finalizedAt: new Date(),
        finalizerId,
      },
      answers: visitFormData.answers?.map((answer) => ({
        questionId: answer.questionId,
        answer: answer.answer,
        comment: answer.comment,
      })),
    },
  };
  const { data } = await axiosConfig.serverApi.post<UpdateVisitFormResponse>("", {
    query: UPDATE_VISIT_FORM,
    variables,
  });
  return data.data.updateVisitForm.id;
};

const updateVisitFormState = async (visitFormId: string | undefined, state: VisitFormState): Promise<void | never> => {
  if (visitFormId === undefined) {
    throw new Error("Visit form id is undefined!");
  }

  const variables: IUpdateVisitFormStateInput = {
    updateVisitFormInput: {
      id: visitFormId,
      state,
    },
  };
  axiosConfig.serverApi.post<UpdateVisitFormResponse>("", {
    query: UPDATE_VISIT_FORM,
    variables,
  });
};

export const markVisitFormAsSentToMafilDb = async (visitFormId: string | undefined): Promise<void> =>
  updateVisitFormState(visitFormId, "SENT_TO_MAFILDB");

export const markVisitFormAsPdfGenerated = async (visitFormId: string | undefined): Promise<void> =>
  updateVisitFormState(visitFormId, "PDF_GENERATED");

export const deleteVisitForm = async (visitFormId: string): Promise<void> => {
  const variables = { id: visitFormId };
  axiosConfig.serverApi.post<null>("", {
    query: DELETE_VISIT_FORM,
    variables,
  });
};

const generatePdf = async (
  isPhantom: boolean,
  visitId: string,
  visitFormData: ValidatedFormData,
  finalizerUco: string | undefined,
  probandLanguageCode?: LanguageCode,
  approverUco?: string
): Promise<IPdfDTO> => {
  if (finalizerUco === undefined) {
    throw new Error("Missing UCO of the operator who finalized the visit!");
  }

  const variables: IGeneratePdfInput = {
    isPhantom,
    visitId,
    probandLanguageCode,
    projectAcronym: visitFormData.project?.acronym ?? "",
    measuredAt: visitFormData.measuredAt ?? new Date(),
    finalizerUco,
    approverUco,
    name: visitFormData.name,
    surname: visitFormData.surname,
    personalId: visitFormData.personalId,
    birthdate: visitFormData.birthdate,
    genderCode: visitFormData.gender.code,
    nativeLanguageCode: visitFormData.nativeLanguage.code,
    heightCm: visitFormData.heightCm,
    weightKg: visitFormData.weightKg,
    visualCorrectionDioptre: visitFormData.visualCorrectionDioptre,
    handednessCode: visitFormData.handedness.code,
    email: visitFormData.email,
    phone: visitFormData.phone,
    answers: visitFormData.answers.map((answer) => ({
      questionId: answer.questionId,
      answer: answer.answer,
      comment: answer.comment,
    })),
  };

  const { data } = await axiosConfig.serverApi.post<GeneratePdfResponse>("", {
    query: GENERATE_PDF,
    variables,
  });
  return data.data.generatePDF;
};

export const generateProbandPdf = async (
  visitId: string,
  visitFormData: ValidatedFormData,
  finalizerUco: string | undefined,
  probandLanguageCode: ProbandVisitLanguageCode | undefined,
  approverUco?: string
): Promise<IPdfDTO> => {
  if (probandLanguageCode === undefined || probandLanguageCode === "") {
    throw new Error("Proband language code is undefined!");
  }

  return generatePdf(false, visitId, visitFormData, finalizerUco, probandLanguageCode, approverUco);
};

export const generatePhantomPdf = async (
  visitId: string,
  visitFormData: ValidatedFormData,
  finalizerUco: string | undefined
): Promise<IPdfDTO> => generatePdf(true, visitId, visitFormData, finalizerUco);
