import i18n, { LanguageCode } from "@app/i18n/i18n";
import { IOperatorAuthorization } from "@app/model/auth";
import {
  ValidatedOperatorFormData,
  ValidatedOperatorModifiedFormData,
  ValidatedProbandFormData,
} from "@app/model/form";
import { ProbandVisitLanguageCode } from "@app/model/visit";
import { serverApi } from "@app/util/axios/serverApi";
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
  IOrderedQuestionDTO,
  IPdfDTO,
  IQuestionDTO,
  ISendVisitFormFromWaitingRoomForApprovalInput,
  IUpdateVisitFormStateInput,
  IWaitingRoomTableVisitFormDTO,
  IWaitingRoomVisitFormIncludingQuestions,
  VisitFormAnswerIncludingQuestion,
  VisitFormState,
} from "@app/util/server_API/dto";
import { createServerApiCallError } from "../error-handling/server-utils";
import { CREATE_VISIT_FORM, REMOVE_VISIT_FORM, UPDATE_VISIT_FORM } from "./mutations";
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
  RemoveVisitFormResponse,
  SafetyInfoResponse,
  UpdateVisitFormResponse,
  WaitingRoomTableVisitFormsResponse,
  WaitingRoomVisitFormResponse,
} from "./response-types";

export const authenticateOperator = async (loggingOperator: IOperatorAuthorization): Promise<IOperatorDTO | never> => {
  const variables: IOperatorAuthorization = { ...loggingOperator };
  const { data } = await serverApi.post<AuthenticateOperatorResponse>("", {
    query: AUTHENTICATE_OPERATOR,
    variables,
  });

  if (data.data) {
    return data.data.authenticateOperator;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchOperator = async (username: string): Promise<IOperatorDTO | never> => {
  const variables = { username };
  const { data } = await serverApi.post<OperatorResponse>("", { query: GET_OPERATOR, variables });

  if (data.data) {
    return data.data.operator;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchGenders = async (): Promise<IGenderDTO[] | never> => {
  const { data } = await serverApi.post<GendersResponse>("", { query: GET_GENDERS });

  if (data.data) {
    return data.data.genders;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchGender = async (code: string): Promise<IGenderDTO | never> => {
  const variables = { code };
  const { data } = await serverApi.post<GenderResponse>("", { query: GET_GENDER, variables });

  if (data.data) {
    return data.data.gender;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchNativeLanguages = async (): Promise<INativeLanguageDTO[] | never> => {
  const { data } = await serverApi.post<NativeLanguagesResponse>("", { query: GET_NATIVE_LANGUAGES });

  if (data.data) {
    return data.data.nativeLanguages;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchNativeLanguage = async (code: string): Promise<INativeLanguageDTO | never> => {
  const variables = { code };
  const { data } = await serverApi.post<NativeLanguageResponse>("", {
    query: GET_NATIVE_LANGUAGE,
    variables,
  });

  if (data.data) {
    return data.data.nativeLanguage;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchHandednesses = async (): Promise<IHandednessDTO[] | never> => {
  const { data } = await serverApi.post<HandednessesResponse>("", { query: GET_HANDEDNESSES });

  if (data.data) {
    return data.data.handednesses;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchHandedness = async (code: string): Promise<IHandednessDTO | never> => {
  const variables = { code };
  const { data } = await serverApi.post<HandednessResponse>("", { query: GET_HANDEDNESS, variables });

  if (data.data) {
    return data.data.handedness;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchCurrentQuestions = async (): Promise<IOrderedQuestionDTO[] | never> => {
  const { data } = await serverApi.post<CurrentQuestionsResponse>("", { query: GET_CURRENT_QUESTIONS });

  if (data.data) {
    return data.data.questions;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchQuestion = async (questionId: string): Promise<IQuestionDTO | never> => {
  const variables = { id: questionId };
  const { data } = await serverApi.post<QuestionResponse>("", { query: GET_QUESTION, variables });

  if (data.data) {
    return data.data.question;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchEntryInfo = async (locale: LanguageCode): Promise<IHTMLCardDTO | never> => {
  const variables = { locale };
  const { data } = await serverApi.post<EntryInfoResponse>("", {
    query: GET_ENTRY_INFO,
    variables,
  });

  if (data.data) {
    return data.data.entryInfo;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchSafetyInfo = async (locale: LanguageCode): Promise<IHTMLCardDTO | never> => {
  const variables = { locale };
  const { data } = await serverApi.post<SafetyInfoResponse>("", {
    query: GET_SAFETY_INFO,
    variables,
  });

  if (data.data) {
    return data.data.safetyInfo;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchBeforeExamination = async (locale: LanguageCode): Promise<IHTMLCardDTO | never> => {
  const variables = { locale };
  const { data } = await serverApi.post<BeforeExaminationResponse>("", {
    query: GET_BEFORE_EXAMINATION,
    variables,
  });

  if (data.data) {
    return data.data.beforeExamination;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchExaminationConsent = async (locale: LanguageCode): Promise<IHTMLCardDTO | never> => {
  const variables = { locale };
  const { data } = await serverApi.post<ExaminationConsentResponse>("", {
    query: GET_EXAMINATION_CONSENT,
    variables,
  });

  if (data.data) {
    return data.data.examinationConsent;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchProbandContactRequest = async (
  locale: LanguageCode,
  name: string,
  surname: string,
  birthdateStr: string,
  currentDateStr: string
): Promise<IHTMLCardDTO | never> => {
  const variables = { locale, name, surname, birthdateStr, currentDateStr };
  const { data } = await serverApi.post<ProbandContactRequestResponse>("", {
    query: GET_PROBAND_CONTACT_REQUEST,
    variables,
  });

  if (data.data) {
    return data.data.probandContactRequest;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchProbandContactConsent = async (locale: LanguageCode): Promise<IHTMLCardDTO | never> => {
  const variables = { locale };
  const { data } = await serverApi.post<ProbandContactConsentResponse>("", {
    query: GET_PROBAND_CONTACT_CONSENT,
    variables,
  });

  if (data.data) {
    return data.data.probandContactConsent;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchWaitingRoomTableVisitForms = async (): Promise<IWaitingRoomTableVisitFormDTO[] | never> => {
  const variables = { state: "NEW" };
  const { data } = await serverApi.post<WaitingRoomTableVisitFormsResponse>("", {
    query: GET_WAITING_ROOM_TABLE_VISIT_FORMS,
    variables,
  });

  if (data.data) {
    return data.data.visitForms;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchWaitingRoomVisitForm = async (
  id: string | undefined
): Promise<IWaitingRoomVisitFormIncludingQuestions | never> => {
  if (id === undefined) {
    throw new Error("Missing visit form ID!");
  }

  const variables = { id };
  const { data } = await serverApi.post<WaitingRoomVisitFormResponse>("", {
    query: GET_WAITING_ROOM_VISIT_FORM,
    variables,
  });

  if (data.data === null || data.data === undefined) {
    throw createServerApiCallError(data.errors);
  }

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
        order: question.order,
        hiddenByGenders: question.hiddenByGenders,
        translations: question.translations,
        updatedAt: question.updatedAt,
      };
    })
  );
  return { ...visitForm, probandLanguageCode: visitForm.probandLanguage.code, answersIncludingQuestions };
};

export const fetchApprovalRoomTableVisitForms = async (): Promise<IApprovalRoomTableVisitFormDTO[] | never> => {
  const variables = { state: "IN_APPROVAL" };
  const { data } = await serverApi.post<ApprovalRoomTableVisitFormsResponse>("", {
    query: GET_APPROVAL_ROOM_TABLE_VISIT_FORMS,
    variables,
  });

  if (data.data) {
    return data.data.visitForms;
  }

  throw createServerApiCallError(data.errors);
};

export const fetchApprovalRoomVisitForm = async (
  id: string | undefined
): Promise<IApprovalRoomVisitFormIncludingQuestionsDTO | never> => {
  if (id === undefined) {
    throw new Error("Missing visit ID!");
  }

  const variables = { id };
  const { data } = await serverApi.post<ApprovalRoomVisitFormResponse>("", {
    query: GET_APPROVAL_ROOM_VISIT_FORM,
    variables,
  });

  if (data.data === null || data.data === undefined) {
    throw createServerApiCallError(data.errors);
  }

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
        order: question.order,
        hiddenByGenders: question.hiddenByGenders,
        translations: question.translations,
        updatedAt: question.updatedAt,
      };
    })
  );
  return { ...visitForm, probandLanguageCode: visitForm.probandLanguage.code, answersIncludingQuestions };
};

export const createProbandVisitForm = async (visitFormData: ValidatedProbandFormData): Promise<string | never> => {
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
  const { data } = await serverApi.post<CreateVisitFormResponse>("", {
    query: CREATE_VISIT_FORM,
    variables,
  });

  if (data.data) {
    return data.data.createVisitForm.id;
  }

  throw createServerApiCallError(data.errors);
};

export const createDuplicatedVisitFormForApproval = async (
  visitFormData: ValidatedOperatorFormData,
  finalizerId: string | undefined
): Promise<string | never> => {
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
        projectUuid: visitFormData.project.uuid,
        projectAcronym: visitFormData.project.acronym,
        deviceId: visitFormData.device.id,
        deviceName: visitFormData.device.name,
        measuredAt: visitFormData.measuredAt,
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
  const { data } = await serverApi.post<CreateVisitFormResponse>("", {
    query: CREATE_VISIT_FORM,
    variables,
  });

  if (data.data) {
    return data.data.createVisitForm.id;
  }

  throw createServerApiCallError(data.errors);
};

export const sendVisitFormForApproval = async (
  visitFormId: string,
  visitFormData: ValidatedOperatorModifiedFormData,
  finalizerId: string
): Promise<string | never> => {
  const variables: ISendVisitFormFromWaitingRoomForApprovalInput = {
    updateVisitFormInput: {
      id: visitFormId,
      state: "IN_APPROVAL",
      name: visitFormData.name === "" ? undefined : visitFormData.name,
      surname: visitFormData.surname === "" ? undefined : visitFormData.surname,
      personalId: visitFormData.personalId === "" ? undefined : visitFormData.personalId,
      birthdate: visitFormData.birthdate,
      genderId: visitFormData.gender?.id,
      nativeLanguageId: visitFormData.nativeLanguage?.id,
      heightCm: visitFormData.heightCm,
      weightKg: visitFormData.weightKg,
      visualCorrectionDioptre: visitFormData.visualCorrectionDioptre,
      handednessId: visitFormData.handedness?.id,
      email: visitFormData.email,
      phone: visitFormData.phone,
      additionalInfo: {
        projectUuid: visitFormData.project.uuid,
        projectAcronym: visitFormData.project.acronym,
        deviceId: visitFormData.device.id,
        deviceName: visitFormData.device.name,
        measuredAt: visitFormData.measuredAt,
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
  const { data } = await serverApi.post<UpdateVisitFormResponse>("", {
    query: UPDATE_VISIT_FORM,
    variables,
  });

  if (data.data) {
    return data.data.updateVisitForm.id;
  }

  throw createServerApiCallError(data.errors);
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
  const { data } = await serverApi.post<UpdateVisitFormResponse>("", {
    query: UPDATE_VISIT_FORM,
    variables,
  });

  if (data.data) {
    return;
  }

  throw createServerApiCallError(data.errors);
};

export const markVisitFormAsSentToMafilDb = async (visitFormId: string | undefined): Promise<void> =>
  updateVisitFormState(visitFormId, "SENT_TO_MAFILDB");

export const markVisitFormAsPdfGenerated = async (visitFormId: string | undefined): Promise<void> =>
  updateVisitFormState(visitFormId, "PDF_GENERATED");

export const deleteVisitForm = async (visitFormId: string): Promise<void | never> => {
  const variables = { id: visitFormId };
  const { data } = await serverApi.post<RemoveVisitFormResponse>("", {
    query: REMOVE_VISIT_FORM,
    variables,
  });

  if (data.errors) {
    throw createServerApiCallError(data.errors);
  }
};

const generatePdf = async (
  isPhantom: boolean,
  visitId: string,
  visitFormData: ValidatedOperatorFormData,
  finalizerUsername: string | undefined,
  probandLanguageCode?: LanguageCode,
  approverUsername?: string
): Promise<IPdfDTO | never> => {
  if (finalizerUsername === undefined) {
    throw new Error("Missing username of the operator who finalized the visit!");
  }

  const variables: IGeneratePdfInput = {
    isPhantom,
    visitId,
    probandLanguageCode,
    projectAcronym: visitFormData.project.acronym,
    measuredAt: visitFormData.measuredAt,
    finalizerUsername,
    approverUsername,
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

  const { data } = await serverApi.post<GeneratePdfResponse>("", {
    query: GENERATE_PDF,
    variables,
  });

  if (data.data) {
    return data.data.generatePDF;
  }

  throw createServerApiCallError(data.errors);
};

export const generateProbandPdf = async (
  visitId: string,
  visitFormData: ValidatedOperatorFormData,
  finalizerUsername: string | undefined,
  probandLanguageCode: ProbandVisitLanguageCode | undefined,
  approverUsername?: string
): Promise<IPdfDTO | never> => {
  if (probandLanguageCode === undefined || probandLanguageCode === "") {
    throw new Error("Proband language code is undefined!");
  }

  return generatePdf(false, visitId, visitFormData, finalizerUsername, probandLanguageCode, approverUsername);
};

export const generatePhantomPdf = async (
  visitId: string,
  visitFormData: ValidatedOperatorFormData,
  finalizerUsername: string | undefined
): Promise<IPdfDTO> => generatePdf(true, visitId, visitFormData, finalizerUsername);
