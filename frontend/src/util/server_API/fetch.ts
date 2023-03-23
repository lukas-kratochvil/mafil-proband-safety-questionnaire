import axiosConfig from "@app/axios-config";
import { dummyVisits } from "@app/data/visit_data";
import i18n, { LocalizationKeys } from "@app/i18n";
import { IAuthGateOperator } from "@app/interfaces/auth";
import { FormPropType } from "@app/interfaces/form";
import { AnswerOption, IVisit, VisitState } from "@app/interfaces/visit";
import {
  IApprovalRoomVisitFormDTO,
  ICreateDuplicatedVisitFormForApprovalInput,
  ICreateProbandVisitFormInput,
  IGenderDTO,
  IHandednessDTO,
  INativeLanguageDTO,
  IOperatorDTO,
  IQuestionDTO,
  IWaitingRoomVisitFormDTO,
} from "@app/util/server_API/dto";
import { CREATE_VISIT_FORM } from "./mutations";
import {
  AUTHENTICATE_OPERATOR,
  GET_APPROVAL_ROOM_VISIT_FORM,
  GET_CURRENT_QUESTIONS,
  GET_GENDERS,
  GET_HANDEDNESSES,
  GET_NATIVE_LANGUAGES,
  GET_QUESTION,
  GET_WAITING_ROOM_VISIT_FORM,
} from "./queries";
import {
  ApprovalRoomVisitFormResponse,
  AuthenticateOperatorResponse,
  CreateVisitFormResponse,
  GendersResponse,
  HandednessesResponse,
  NativeLanguagesResponse,
  QuestionResponse,
  QuestionsResponse,
  WaitingRoomVisitFormResponse,
} from "./response-types";

export const authenticateOperator = async (loggingOperator: IAuthGateOperator): Promise<IOperatorDTO | undefined> => {
  const variables: IAuthGateOperator = { ...loggingOperator };
  const { data } = await axiosConfig.serverApi.post<AuthenticateOperatorResponse>("", {
    query: AUTHENTICATE_OPERATOR,
    variables,
  });
  return { ...loggingOperator, ...data.data.authenticateOperator };
};

export const fetchGenders = async (): Promise<IGenderDTO[]> => {
  const { data } = await axiosConfig.serverApi.post<GendersResponse>("", { query: GET_GENDERS });
  return data.data.genders;
};

export const fetchNativeLanguages = async (): Promise<INativeLanguageDTO[]> => {
  const { data } = await axiosConfig.serverApi.post<NativeLanguagesResponse>("", { query: GET_NATIVE_LANGUAGES });
  return data.data.nativeLanguages;
};

export const fetchHandednesses = async (): Promise<IHandednessDTO[]> => {
  const { data } = await axiosConfig.serverApi.post<HandednessesResponse>("", { query: GET_HANDEDNESSES });
  return data.data.handednesses;
};

export const fetchCurrentQuestions = async (): Promise<IQuestionDTO[]> => {
  const { data } = await axiosConfig.serverApi.post<QuestionsResponse>("", { query: GET_CURRENT_QUESTIONS });
  return data.data.questions;
};

export const fetchQuestion = async (questionId: string): Promise<IQuestionDTO> => {
  const variables = { id: questionId };
  const { data } = await axiosConfig.serverApi.post<QuestionResponse>("", { query: GET_QUESTION, variables });
  return data.data.question;
};

export const fetchWaitingRoomVisitForm = async (
  visitId: string | undefined
): Promise<IWaitingRoomVisitFormDTO | undefined> => {
  const variables = { id: visitId };
  const { data } = await axiosConfig.serverApi.post<WaitingRoomVisitFormResponse>("", {
    query: GET_WAITING_ROOM_VISIT_FORM,
    variables,
  });
  return data.data.visitForm;
};

export const fetchApprovalRoomVisitForm = async (
  visitId: string | undefined
): Promise<IApprovalRoomVisitFormDTO | undefined> => {
  const variables = { id: visitId };
  const { data } = await axiosConfig.serverApi.post<ApprovalRoomVisitFormResponse>("", {
    query: GET_APPROVAL_ROOM_VISIT_FORM,
    variables,
  });
  return data.data.visitForm;
};

// TODO: get visits from DB
export const fetchWaitingRoomVisitForms = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) => visit.state === VisitState.NEW);

// TODO: get visits from DB
export const fetchApprovalRoomVisitForms = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) => visit.state === VisitState.IN_APPROVAL);

export const createProbandVisitForm = async (visitFormData: FormPropType): Promise<string> => {
  const variables: ICreateProbandVisitFormInput = {
    createVisitFormInput: {
      probandLanguageCode: i18n.language as LocalizationKeys,
      probandInfo: {
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
      },
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
      additionalInfo: {
        projectId: visitFormData.project?.id ?? "",
        projectAcronym: visitFormData.project?.acronym ?? "",
        deviceId: visitFormData.device?.id ?? "",
        deviceName: visitFormData.device?.name ?? "",
        measuredAt: visitFormData.measurementDate ?? new Date(),
        finalizerId: finalizerId ?? "",
        finalizedAt: new Date(),
      },
      probandLanguageCode: i18n.language as LocalizationKeys,
      probandInfo: {
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
      },
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
