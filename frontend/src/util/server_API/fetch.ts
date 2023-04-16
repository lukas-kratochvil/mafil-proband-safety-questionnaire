import axiosConfig from "@app/axios-config";
import i18n, { LanguageCode } from "@app/i18n";
import { IOperatorAuthorization } from "@app/model/auth";
import { AnswerOption, FormPropType } from "@app/model/form";
import {
  IApprovalRoomTableVisitFormDTO,
  IApprovalRoomVisitFormIncludingQuestionsDTO,
  ICreateDuplicatedVisitFormForApprovalInput,
  ICreateProbandVisitFormInput,
  IGenderDTO,
  IHandednessDTO,
  IHTMLCardDTO,
  INativeLanguageDTO,
  IOperatorDTO,
  IQuestionDTO,
  ISendVisitFormFromWaitingRoomForApprovalInput,
  IWaitingRoomTableVisitFormDTO,
  IWaitingRoomVisitFormIncludingQuestionsDTO,
  VisitFormAnswerIncludingQuestion,
} from "@app/util/server_API/dto";
import { CREATE_VISIT_FORM, DELETE_VISIT_FORM, UPDATE_VISIT_FORM } from "./mutations";
import {
  AUTHENTICATE_OPERATOR,
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
  HandednessResponse,
  HandednessesResponse,
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
  const { data } = await axiosConfig.serverApi.post<NativeLanguageResponse>("", { query: GET_NATIVE_LANGUAGE, variables });
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
): Promise<IWaitingRoomVisitFormIncludingQuestionsDTO | undefined> => {
  const variables = { id: visitId };
  const { data } = await axiosConfig.serverApi.post<WaitingRoomVisitFormResponse>("", {
    query: GET_WAITING_ROOM_VISIT_FORM,
    variables,
  });
  const { visitForm } = data.data;
  const answersIncludingQuestions = await Promise.all(
    visitForm.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
      const question = await fetchQuestion(answer.questionId);
      return { ...answer, ...question, comment: "" };
    })
  );
  return { ...visitForm, answersIncludingQuestions };
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
): Promise<IApprovalRoomVisitFormIncludingQuestionsDTO | undefined> => {
  const variables = { id: visitId };
  const { data } = await axiosConfig.serverApi.post<ApprovalRoomVisitFormResponse>("", {
    query: GET_APPROVAL_ROOM_VISIT_FORM,
    variables,
  });
  const { visitForm } = data.data;
  const answersIncludingQuestions = await Promise.all(
    visitForm.answers.map(async (answer): Promise<VisitFormAnswerIncludingQuestion> => {
      const question = await fetchQuestion(answer.questionId);
      return { ...answer, ...question };
    })
  );
  return { ...visitForm, answersIncludingQuestions };
};

export const createProbandVisitForm = async (visitFormData: FormPropType): Promise<string> => {
  const variables: ICreateProbandVisitFormInput = {
    createVisitFormInput: {
      probandLanguageCode: i18n.language as LanguageCode,
      name: visitFormData.name,
      surname: visitFormData.surname,
      personalId: visitFormData.personalId,
      birthdate: visitFormData.birthdate ?? new Date(),
      genderId: visitFormData.gender?.id ?? "",
      nativeLanguageId: visitFormData.nativeLanguage?.id ?? "",
      heightCm: typeof visitFormData.heightCm === "number" ? visitFormData.heightCm : 0,
      weightKg: typeof visitFormData.weightKg === "number" ? visitFormData.weightKg : 0,
      visualCorrectionDioptre:
        typeof visitFormData.visualCorrectionDioptre === "number" ? visitFormData.visualCorrectionDioptre : 0,
      handednessId: visitFormData.handedness?.id ?? "",
      email: visitFormData.email,
      phone: visitFormData.phone,
      answers: visitFormData.answers.map((answer) => ({
        questionId: answer.questionId,
        answer: answer.answer ?? AnswerOption.NO,
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
  visitFormData: FormPropType,
  finalizerId: string | undefined
): Promise<string> => {
  const variables: ICreateDuplicatedVisitFormForApprovalInput = {
    createVisitFormInput: {
      state: "IN_APPROVAL",
      name: visitFormData.name,
      surname: visitFormData.surname,
      personalId: visitFormData.personalId,
      birthdate: visitFormData.birthdate ?? new Date(),
      genderId: visitFormData.gender?.id ?? "",
      nativeLanguageId: visitFormData.nativeLanguage?.id ?? "",
      heightCm: typeof visitFormData.heightCm === "number" ? visitFormData.heightCm : 0,
      weightKg: typeof visitFormData.weightKg === "number" ? visitFormData.weightKg : 0,
      visualCorrectionDioptre:
        typeof visitFormData.visualCorrectionDioptre === "number" ? visitFormData.visualCorrectionDioptre : 0,
      handednessId: visitFormData.handedness?.id ?? "",
      email: visitFormData.email,
      phone: visitFormData.phone,
      additionalInfo: {
        projectId: visitFormData.project?.id ?? "",
        projectAcronym: visitFormData.project?.acronym ?? "",
        deviceId: visitFormData.device?.id ?? "",
        deviceName: visitFormData.device?.name ?? "",
        measuredAt: visitFormData.measuredAt ?? new Date(),
        finalizerId: finalizerId ?? "",
        finalizedAt: new Date(),
      },
      probandLanguageCode: i18n.language as LanguageCode,
      answers: visitFormData.answers.map((answer) => ({
        questionId: answer.questionId,
        answer: answer.answer ?? AnswerOption.NO,
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
  visitFormData: Partial<FormPropType>,
  finalizerId: string
): Promise<string> => {
  const variables: ISendVisitFormFromWaitingRoomForApprovalInput = {
    updateVisitFormInput: {
      id: visitFormId,
      state: "IN_APPROVAL",
      name: visitFormData.name === "" ? undefined : visitFormData.name,
      surname: visitFormData.surname === "" ? undefined : visitFormData.surname,
      personalId: visitFormData.personalId === "" ? undefined : visitFormData.personalId,
      birthdate: visitFormData.birthdate ?? undefined,
      genderId: visitFormData.gender?.id ?? undefined,
      nativeLanguageId: visitFormData.nativeLanguage?.id ?? undefined,
      heightCm: typeof visitFormData.heightCm === "number" ? visitFormData.heightCm : undefined,
      weightKg: typeof visitFormData.weightKg === "number" ? visitFormData.weightKg : undefined,
      visualCorrectionDioptre:
        typeof visitFormData.visualCorrectionDioptre === "number" ? visitFormData.visualCorrectionDioptre : undefined,
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
      answers:
        visitFormData.answers?.map((answer) => ({
          questionId: answer.questionId,
          answer: answer.answer ?? undefined,
          comment: answer.comment,
        })) ?? [],
    },
  };
  const { data } = await axiosConfig.serverApi.post<UpdateVisitFormResponse>("", {
    query: UPDATE_VISIT_FORM,
    variables,
  });
  return data.data.updateVisitForm.id;
};

export const deleteVisitForm = async (visitFormId: string): Promise<void> => {
  const variables = { id: visitFormId };
  // TODO: remove the 'await' here?
  await axiosConfig.serverApi.post<null>("", {
    query: DELETE_VISIT_FORM,
    variables,
  });
};
