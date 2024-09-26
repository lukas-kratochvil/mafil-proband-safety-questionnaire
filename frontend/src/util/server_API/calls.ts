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
  PdfDTO,
  QuestionDTO,
  SendVisitFormFromWaitingRoomForApprovalInput,
  UpdateVisitFormDTO,
  UpdateVisitFormStateInput,
  VisitFormAnswerIncludingQuestion,
  VisitFormState,
  WaitingRoomVisitFormIncludingQuestions,
} from "@app/util/server_API/dto";
import { createServerApiCallError, type GraphQlError } from "../error-handling/server-utils";
import { fetchNativeLanguage, fetchProject } from "../mafildb_API/calls";
import { isBase64PDFContent } from "../utils";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
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

// GraphQL request body format: https://graphql.org/learn/serving-over-http/#post-request
type RequestData<TVariables> = {
  query: string;
  operationName?: string;
  variables?: TVariables;
};

// Generic server GraphQL API response format: https://graphql.org/learn/serving-over-http/#response
type ResponseData<TData> = {
  data?: TData | null;
  errors?: GraphQlError[];
};

// Extract operation name from the query
const extractGraphQLOperationName = (query: string): string | undefined => {
  const match = query.match(/^\s*(query|mutation)\s(\w+).*/);
  return match ? match[2] : undefined;
};

// Using HTTP POST to transfer GraphQL queries/mutations: https://graphql.org/learn/serving-over-http/#post-request
const serverApiCall = async <TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> => {
  const { data } = await serverApi.post<
    ResponseData<TData>,
    AxiosResponse<ResponseData<TData>, RequestData<TVariables>>,
    RequestData<TVariables>
  >("", {
    query,
    operationName: extractGraphQLOperationName(query),
    variables,
  });

  if (data.data) {
    return data.data;
  }

  throw createServerApiCallError(data.errors);
};

export const authenticateOperator = async (loggingOperator: OperatorAuthInput): Promise<OperatorDTO> => {
  const data = await serverApiCall<AuthenticateOperatorResponse>(queries.AUTHENTICATE_OPERATOR, loggingOperator);
  return data.authenticateOperator;
};

export const fetchOperator = async (username: string): Promise<OperatorDTO> => {
  const variables = { username };
  const data = await serverApiCall<OperatorResponse, typeof variables>(queries.GET_OPERATOR, variables);
  return data.operator;
};

export const fetchGenders = async (): Promise<GenderDTO[]> => {
  const data = await serverApiCall<GendersResponse>(queries.GET_GENDERS);
  return data.genders;
};

export const fetchGender = async (code: GenderCode): Promise<GenderDTO> => {
  const variables = { code };
  const data = await serverApiCall<GenderResponse>(queries.GET_GENDER, variables);
  return data.gender;
};

export const fetchHandednesses = async (): Promise<HandednessDTO[]> => {
  const data = await serverApiCall<HandednessesResponse>(queries.GET_HANDEDNESSES);
  return data.handednesses;
};

export const fetchHandedness = async (code: HandednessCode): Promise<HandednessDTO> => {
  const variables = { code };
  const data = await serverApiCall<HandednessResponse>(queries.GET_HANDEDNESS, variables);
  return data.handedness;
};

export const fetchCurrentQuestions = async (): Promise<QuestionDTO[]> => {
  const data = await serverApiCall<CurrentQuestionsResponse>(queries.GET_CURRENT_QUESTIONS);
  return data.questions;
};

export const fetchQuestion = async (questionId: string): Promise<QuestionDTO> => {
  const variables = { id: questionId };
  const data = await serverApiCall<QuestionResponse>(queries.GET_QUESTION, variables);
  return data.question;
};

export const fetchEntryInfo = async (locale: LanguageCode): Promise<HTMLCardDTO> => {
  const variables = { locale };
  const data = await serverApiCall<EntryInfoResponse>(queries.GET_ENTRY_INFO, variables);
  return data.entryInfo;
};

export const fetchSafetyInfo = async (locale: LanguageCode): Promise<HTMLCardDTO> => {
  const variables = { locale };
  const data = await serverApiCall<SafetyInfoResponse>(queries.GET_SAFETY_INFO, variables);
  return data.safetyInfo;
};

export const fetchBeforeExamination = async (locale: LanguageCode): Promise<HTMLCardDTO> => {
  const variables = { locale };
  const data = await serverApiCall<BeforeExaminationResponse>(queries.GET_BEFORE_EXAMINATION, variables);
  return data.beforeExamination;
};

export const fetchExaminationConsent = async (locale: LanguageCode): Promise<HTMLCardDTO> => {
  const variables = { locale };
  const data = await serverApiCall<ExaminationConsentResponse>(queries.GET_EXAMINATION_CONSENT, variables);
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
  const data = await serverApiCall<ProbandContactRequestResponse>(queries.GET_PROBAND_CONTACT_REQUEST, variables);
  return data.probandContactRequest;
};

export const fetchProbandContactConsent = async (locale: LanguageCode): Promise<HTMLCardDTO> => {
  const variables = { locale };
  const data = await serverApiCall<ProbandContactConsentResponse>(queries.GET_PROBAND_CONTACT_CONSENT, variables);
  return data.probandContactConsent;
};

export const fetchWaitingRoomTableVisitForms = async (): Promise<WaitingRoomTableVisitForm[]> => {
  const variables = { state: "NEW" };
  const data = await serverApiCall<WaitingRoomTableVisitFormsResponse>(
    queries.GET_WAITING_ROOM_TABLE_VISIT_FORMS,
    variables
  );
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

export const fetchWaitingRoomVisitForm = async (id: string): Promise<WaitingRoomVisitFormIncludingQuestions> => {
  const variables = { id };
  const data = await serverApiCall<WaitingRoomVisitFormResponse>(queries.GET_WAITING_ROOM_VISIT_FORM, variables);
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
  const data = await serverApiCall<ApprovalRoomTableVisitFormsResponse>(
    queries.GET_APPROVAL_ROOM_TABLE_VISIT_FORMS,
    variables
  );
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

export const fetchApprovalRoomVisitForm = async (id: string): Promise<ApprovalRoomVisitFormIncludingQuestionsDTO> => {
  const variables = { id };
  const data = await serverApiCall<ApprovalRoomVisitFormResponse>(queries.GET_APPROVAL_ROOM_VISIT_FORM, variables);
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
  const data = await serverApiCall<CreateVisitFormResponse>(mutations.CREATE_VISIT_FORM, variables);
  return data.createVisitForm.id;
};

export const createDuplicatedVisitFormForApproval = async (
  visitFormData: ValidatedOperatorFormData,
  finalizerId: string
): Promise<string> => {
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
  const data = await serverApiCall<CreateVisitFormResponse>(mutations.CREATE_VISIT_FORM, variables);
  return data.createVisitForm.id;
};

export const sendVisitFormForApproval = async (
  id: string,
  visitFormData: ValidatedOperatorModifiedFormData,
  finalizerId: string
): Promise<string> => {
  const variables: SendVisitFormFromWaitingRoomForApprovalInput = {
    updateVisitFormInput: {
      id,
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
  const data = await serverApiCall<UpdateVisitFormResponse>(mutations.UPDATE_VISIT_FORM, variables);
  return data.updateVisitForm.id;
};

const updateVisitFormState = async (id: string, state: Exclude<VisitFormState, "NEW">): Promise<UpdateVisitFormDTO> => {
  const variables: UpdateVisitFormStateInput = {
    updateVisitFormInput: {
      id,
      state,
    },
  };

  const data = await serverApiCall<UpdateVisitFormResponse>(mutations.UPDATE_VISIT_FORM, variables);
  return data.updateVisitForm;
};

export const markVisitFormAsSentToMafilDb = async (id: string): Promise<UpdateVisitFormDTO> =>
  updateVisitFormState(id, "SENT_TO_MAFILDB");

export const markVisitFormAsPdfGenerated = async (id: string): Promise<UpdateVisitFormDTO> =>
  updateVisitFormState(id, "PDF_GENERATED");

export const deleteVisitForm = async (id: string): Promise<null> => {
  const variables = { id };
  const data = await serverApiCall<RemoveVisitFormResponse>(mutations.REMOVE_VISIT_FORM, variables);
  return data.removeVisitForm;
};

const generatePdf = async (
  isPhantom: boolean,
  visitId: string,
  visitFormData: ValidatedOperatorFormData,
  finalizerUsername: string,
  probandLanguageCode?: LanguageCode,
  approverUsername?: string
): Promise<PdfDTO> => {
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
  const data = await serverApiCall<GeneratePdfResponse>(queries.GENERATE_PDF, variables);

  if (!isBase64PDFContent(data.generatePDF.content)) {
    throw new Error("Generated PDF has malformed content!");
  }

  return data.generatePDF;
};

export const generateProbandPdf = async (
  visitId: string,
  visitFormData: ValidatedOperatorFormData,
  finalizerUsername: string,
  probandLanguageCode: LanguageCode | undefined,
  approverUsername?: string
): Promise<PdfDTO> =>
  generatePdf(false, visitId, visitFormData, finalizerUsername, probandLanguageCode, approverUsername);

export const generatePhantomPdf = async (
  visitId: string,
  visitFormData: ValidatedOperatorFormData,
  finalizerUsername: string
): Promise<PdfDTO> => generatePdf(true, visitId, visitFormData, finalizerUsername);
