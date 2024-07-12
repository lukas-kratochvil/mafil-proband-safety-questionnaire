import type { AxiosResponse } from "axios";
import i18n, { type LanguageCode } from "@app/i18n/i18n";
import type {
  ValidatedOperatorFormData,
  ValidatedOperatorModifiedFormData,
  ValidatedProbandFormData,
} from "@app/model/form";
import type { ApprovalRoomTableVisitForm, WaitingRoomTableVisitForm } from "@app/model/visitForm";
import { serverApi } from "@app/util/axios/serverApi";
import type {
  ApprovalRoomVisitFormIncludingQuestionsDTO,
  CreateDuplicatedVisitFormForApprovalInput,
  CreateProbandVisitFormInput,
  GenderCode,
  GenderDTO,
  GeneratePdfInput,
  HandednessCode,
  HandednessDTO,
  HTMLCardDTO,
  OperatorAuthInput,
  OperatorDTO,
  OrderedQuestionDTO,
  PdfDTO,
  QuestionDTO,
  SendVisitFormFromWaitingRoomForApprovalInput,
  UpdateVisitFormStateInput,
  VisitFormAnswerIncludingQuestion,
  VisitFormState,
  WaitingRoomVisitFormIncludingQuestions,
} from "@app/util/server_API/dto";
import { createServerApiCallError, type GraphQlError } from "../error-handling/server-utils";
import { fetchNativeLanguage, fetchProject } from "../mafildb_API/calls";
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
  GET_OPERATOR,
  GET_PROBAND_CONTACT_CONSENT,
  GET_PROBAND_CONTACT_REQUEST,
  GET_QUESTION,
  GET_SAFETY_INFO,
  GET_WAITING_ROOM_TABLE_VISIT_FORMS,
  GET_WAITING_ROOM_VISIT_FORM,
} from "./queries";
import type {
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

const serverApiCall = async <TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> => {
  type RequestData = {
    query: string;
    variables?: TVariables;
  };
  // Generic server GraphQL API response type
  type ResponseData = {
    data?: TData | null;
    errors?: GraphQlError[];
  };
  const { data } = await serverApi.post<ResponseData, AxiosResponse<ResponseData>, RequestData>("", {
    query,
    variables,
  });

  if (data.data) {
    return data.data;
  }

  throw createServerApiCallError(data.errors);
};

export const authenticateOperator = async (loggingOperator: OperatorAuthInput): Promise<OperatorDTO> => {
  const data = await serverApiCall<AuthenticateOperatorResponse>(AUTHENTICATE_OPERATOR, loggingOperator);
  return data.authenticateOperator;
};

export const fetchOperator = async (username: string): Promise<OperatorDTO> => {
  const variables = { username };
  const data = await serverApiCall<OperatorResponse, typeof variables>(GET_OPERATOR, variables);
  return data.operator;
};

export const fetchGenders = async (): Promise<GenderDTO[]> => {
  const data = await serverApiCall<GendersResponse>(GET_GENDERS);
  return data.genders;
};

export const fetchGender = async (code: GenderCode): Promise<GenderDTO> => {
  const variables = { code };
  const data = await serverApiCall<GenderResponse>(GET_GENDER, variables);
  return data.gender;
};

export const fetchHandednesses = async (): Promise<HandednessDTO[]> => {
  const data = await serverApiCall<HandednessesResponse>(GET_HANDEDNESSES);
  return data.handednesses;
};

export const fetchHandedness = async (code: HandednessCode): Promise<HandednessDTO> => {
  const variables = { code };
  const data = await serverApiCall<HandednessResponse>(GET_HANDEDNESS, variables);
  return data.handedness;
};

export const fetchCurrentQuestions = async (): Promise<OrderedQuestionDTO[]> => {
  const data = await serverApiCall<CurrentQuestionsResponse>(GET_CURRENT_QUESTIONS);
  return data.questions;
};

export const fetchQuestion = async (questionId: string): Promise<QuestionDTO> => {
  const variables = { id: questionId };
  const data = await serverApiCall<QuestionResponse>(GET_QUESTION, variables);
  return data.question;
};

export const fetchEntryInfo = async (locale: LanguageCode): Promise<HTMLCardDTO> => {
  const variables = { locale };
  const data = await serverApiCall<EntryInfoResponse>(GET_ENTRY_INFO, variables);
  return data.entryInfo;
};

export const fetchSafetyInfo = async (locale: LanguageCode): Promise<HTMLCardDTO> => {
  const variables = { locale };
  const data = await serverApiCall<SafetyInfoResponse>(GET_SAFETY_INFO, variables);
  return data.safetyInfo;
};

export const fetchBeforeExamination = async (locale: LanguageCode): Promise<HTMLCardDTO> => {
  const variables = { locale };
  const data = await serverApiCall<BeforeExaminationResponse>(GET_BEFORE_EXAMINATION, variables);
  return data.beforeExamination;
};

export const fetchExaminationConsent = async (locale: LanguageCode): Promise<HTMLCardDTO> => {
  const variables = { locale };
  const data = await serverApiCall<ExaminationConsentResponse>(GET_EXAMINATION_CONSENT, variables);
  return data.examinationConsent;
};

export const fetchProbandContactRequest = async (
  locale: LanguageCode,
  name: string,
  surname: string,
  birthdateStr: string,
  currentDateStr: string
): Promise<HTMLCardDTO> => {
  const variables = { locale, name, surname, birthdateStr, currentDateStr };
  const data = await serverApiCall<ProbandContactRequestResponse>(GET_PROBAND_CONTACT_REQUEST, variables);
  return data.probandContactRequest;
};

export const fetchProbandContactConsent = async (locale: LanguageCode): Promise<HTMLCardDTO> => {
  const variables = { locale };
  const data = await serverApiCall<ProbandContactConsentResponse>(GET_PROBAND_CONTACT_CONSENT, variables);
  return data.probandContactConsent;
};

export const fetchWaitingRoomTableVisitForms = async (): Promise<WaitingRoomTableVisitForm[]> => {
  const variables = { state: "NEW" };
  const data = await serverApiCall<WaitingRoomTableVisitFormsResponse>(GET_WAITING_ROOM_TABLE_VISIT_FORMS, variables);
  return Promise.all(
    data.visitForms.map(async (visitForm) => {
      const nativeLanguage = await fetchNativeLanguage(visitForm.nativeLanguageCode);
      return {
        ...visitForm,
        nativeLanguage,
      };
    })
  );
};

export const fetchWaitingRoomVisitForm = async (
  id: string | undefined
): Promise<WaitingRoomVisitFormIncludingQuestions> => {
  if (id === undefined) {
    throw new Error("Missing visit form ID!");
  }

  const variables = { id };
  const data = await serverApiCall<WaitingRoomVisitFormResponse>(GET_WAITING_ROOM_VISIT_FORM, variables);
  const answersIncludingQuestions = await Promise.all(
    data.visitForm.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
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
  return { ...data.visitForm, probandLanguageCode: data.visitForm.probandLanguage.code, answersIncludingQuestions };
};

export const fetchApprovalRoomTableVisitForms = async (): Promise<ApprovalRoomTableVisitForm[]> => {
  const variables = { state: "IN_APPROVAL" };
  const data = await serverApiCall<ApprovalRoomTableVisitFormsResponse>(GET_APPROVAL_ROOM_TABLE_VISIT_FORMS, variables);
  return Promise.all(
    data.visitForms.map(async (visitForm) => {
      const project = await fetchProject(visitForm.additionalInfo.projectUuid);
      const nativeLanguage = await fetchNativeLanguage(visitForm.nativeLanguageCode);
      return {
        ...visitForm,
        project,
        nativeLanguage,
      };
    })
  );
};

export const fetchApprovalRoomVisitForm = async (
  id: string | undefined
): Promise<ApprovalRoomVisitFormIncludingQuestionsDTO> => {
  if (id === undefined) {
    throw new Error("Missing visit ID!");
  }

  const variables = { id };
  const data = await serverApiCall<ApprovalRoomVisitFormResponse>(GET_APPROVAL_ROOM_VISIT_FORM, variables);
  const answersIncludingQuestions = await Promise.all(
    data.visitForm.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
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
  return { ...data.visitForm, probandLanguageCode: data.visitForm.probandLanguage.code, answersIncludingQuestions };
};

export const createProbandVisitForm = async (visitFormData: ValidatedProbandFormData): Promise<string> => {
  const variables: CreateProbandVisitFormInput = {
    createVisitFormInput: {
      probandLanguageCode: i18n.language as LanguageCode,
      name: visitFormData.name,
      surname: visitFormData.surname,
      personalId: visitFormData.personalId,
      birthdate: visitFormData.birthdate,
      genderId: visitFormData.gender.id,
      nativeLanguageCode: visitFormData.nativeLanguage.code,
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
  const data = await serverApiCall<CreateVisitFormResponse>(CREATE_VISIT_FORM, variables);
  return data.createVisitForm.id;
};

export const createDuplicatedVisitFormForApproval = async (
  visitFormData: ValidatedOperatorFormData,
  finalizerId: string | undefined
): Promise<string> => {
  if (finalizerId === undefined) {
    throw new Error("Missing ID of the operator who finalized the visit!");
  }

  const variables: CreateDuplicatedVisitFormForApprovalInput = {
    createVisitFormInput: {
      state: "IN_APPROVAL",
      name: visitFormData.name,
      surname: visitFormData.surname,
      personalId: visitFormData.personalId,
      birthdate: visitFormData.birthdate,
      genderId: visitFormData.gender.id,
      nativeLanguageCode: visitFormData.nativeLanguage.code,
      heightCm: visitFormData.heightCm,
      weightKg: visitFormData.weightKg,
      visualCorrectionDioptre: visitFormData.visualCorrectionDioptre,
      handednessId: visitFormData.handedness.id,
      email: visitFormData.email,
      phone: visitFormData.phone,
      additionalInfo: {
        projectUuid: visitFormData.project.uuid,
        deviceId: visitFormData.device.id,
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
  const data = await serverApiCall<CreateVisitFormResponse>(CREATE_VISIT_FORM, variables);
  return data.createVisitForm.id;
};

export const sendVisitFormForApproval = async (
  visitFormId: string,
  visitFormData: ValidatedOperatorModifiedFormData,
  finalizerId: string
): Promise<string> => {
  const variables: SendVisitFormFromWaitingRoomForApprovalInput = {
    updateVisitFormInput: {
      id: visitFormId,
      state: "IN_APPROVAL",
      name: visitFormData.name === "" ? undefined : visitFormData.name,
      surname: visitFormData.surname === "" ? undefined : visitFormData.surname,
      personalId: visitFormData.personalId === "" ? undefined : visitFormData.personalId,
      birthdate: visitFormData.birthdate,
      genderId: visitFormData.gender?.id,
      nativeLanguageCode: visitFormData.nativeLanguage?.code,
      heightCm: visitFormData.heightCm,
      weightKg: visitFormData.weightKg,
      visualCorrectionDioptre: visitFormData.visualCorrectionDioptre,
      handednessId: visitFormData.handedness?.id,
      email: visitFormData.email,
      phone: visitFormData.phone,
      additionalInfo: {
        projectUuid: visitFormData.project.uuid,
        deviceId: visitFormData.device.id,
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
  const data = await serverApiCall<UpdateVisitFormResponse>(UPDATE_VISIT_FORM, variables);
  return data.updateVisitForm.id;
};

const updateVisitFormState = async (visitFormId: string | undefined, state: VisitFormState): Promise<void> => {
  if (visitFormId === undefined) {
    throw new Error("Visit form id is undefined!");
  }

  const variables: UpdateVisitFormStateInput = {
    updateVisitFormInput: {
      id: visitFormId,
      state,
    },
  };
  void serverApiCall<UpdateVisitFormResponse>(UPDATE_VISIT_FORM, variables);
};

export const markVisitFormAsSentToMafilDb = async (visitFormId: string | undefined): Promise<void> =>
  updateVisitFormState(visitFormId, "SENT_TO_MAFILDB");

export const markVisitFormAsPdfGenerated = async (visitFormId: string | undefined): Promise<void> =>
  updateVisitFormState(visitFormId, "PDF_GENERATED");

export const deleteVisitForm = async (visitFormId: string): Promise<void> => {
  const variables = { id: visitFormId };
  void serverApiCall<RemoveVisitFormResponse>(REMOVE_VISIT_FORM, variables);
};

const generatePdf = async (
  isPhantom: boolean,
  visitId: string,
  visitFormData: ValidatedOperatorFormData,
  finalizerUsername: string | undefined,
  probandLanguageCode?: LanguageCode,
  approverUsername?: string
): Promise<PdfDTO> => {
  if (finalizerUsername === undefined) {
    throw new Error("Missing username of the operator who finalized the visit!");
  }

  const variables: GeneratePdfInput = {
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
    nativeLanguage: {
      nativeName: visitFormData.nativeLanguage.nativeName,
      nameCs: visitFormData.nativeLanguage.nameCs,
    },
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
  const data = await serverApiCall<GeneratePdfResponse>(GENERATE_PDF, variables);
  return data.generatePDF;
};

export const generateProbandPdf = async (
  visitId: string,
  visitFormData: ValidatedOperatorFormData,
  finalizerUsername: string | undefined,
  probandLanguageCode: LanguageCode | undefined,
  approverUsername?: string
): Promise<PdfDTO> => {
  if (probandLanguageCode === undefined) {
    throw new Error("Proband language code is undefined!");
  }

  return generatePdf(false, visitId, visitFormData, finalizerUsername, probandLanguageCode, approverUsername);
};

export const generatePhantomPdf = async (
  visitId: string,
  visitFormData: ValidatedOperatorFormData,
  finalizerUsername: string | undefined
): Promise<PdfDTO> => generatePdf(true, visitId, visitFormData, finalizerUsername);
