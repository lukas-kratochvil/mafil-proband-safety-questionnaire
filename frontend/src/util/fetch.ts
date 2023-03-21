import axiosConfig from "@app/axios-config";
import { trustedOperators } from "@app/data/operator_data";
import { dummyVisits } from "@app/data/visit_data";
import i18n, { LocalizationKeys } from "@app/i18n";
import { IAuthGateOperator } from "@app/interfaces/auth";
import { FormPropType } from "@app/interfaces/form";
import { AnswerOption, IVisit, VisitState } from "@app/interfaces/visit";
import {
  ICreateVisitFormInput,
  IGenderDTO,
  IHandednessDTO,
  INativeLanguageDTO,
  IOperatorDTO,
  IQuestionDTO,
  IVisitFormId,
} from "@app/util/server_API/dto";
import { CREATE_PROBAND_VISIT_FORM } from "./server_API/mutations";
import {
  GET_CURRENT_QUESTIONS,
  GET_GENDERS,
  GET_HANDEDNESSES,
  GET_NATIVE_LANGUAGES,
  GET_QUESTION,
} from "./server_API/queries";
import {
  CreateProbandVisitFormResponse,
  GendersResponse,
  HandednessesResponse,
  NativeLanguagesResponse,
  QuestionResponse,
  QuestionsResponse,
} from "./server_API/response-types";

// TODO: authorize against DB
export const authenticateOperator = async (loggingOperator: IAuthGateOperator): Promise<IOperatorDTO | undefined> =>
  trustedOperators.find(
    (op) => op.name === loggingOperator.name && op.surname === loggingOperator.surname && op.uco === loggingOperator.uco
  );

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

export const createProbandVisitForm = async (visitFormData: FormPropType): Promise<IVisitFormId> => {
  const variables: ICreateVisitFormInput = {
    createVisitFormInput: {
      probandLanguageCode: i18n.language as LocalizationKeys,
      probandInfo: {
        ...visitFormData,
        birthdate: visitFormData.birthdate ?? new Date(),
        genderId: visitFormData.gender?.id ?? "",
        nativeLanguageId: visitFormData.nativeLanguage?.id ?? "",
        heightCm: typeof visitFormData.height === "number" ? visitFormData.height : 0,
        weightKg: typeof visitFormData.weight === "number" ? visitFormData.weight : 0,
        visualCorrectionDioptre:
          typeof visitFormData.visualCorrectionValue === "number" ? visitFormData.visualCorrectionValue : 0,
        handednessId: visitFormData.handedness?.id ?? "",
      },
      answers: visitFormData.answers.map((answer) => ({
        ...answer,
        answer: answer.answer ?? AnswerOption.NO,
      })),
    },
  };
  const { data } = await axiosConfig.serverApi.post<CreateProbandVisitFormResponse>("", {
    query: CREATE_PROBAND_VISIT_FORM,
    variables,
  });
  return data.createVisitForm;
};

// TODO: get visits from DB
export const fetchVisitForm = async (visitId: string | undefined): Promise<IVisit | undefined> =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: get visits from DB
export const fetchWaitingRoomVisitForms = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) => visit.state === VisitState.NEW);

// TODO: get visits from DB
export const fetchApprovalRoomVisitForms = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) => visit.state === VisitState.IN_APPROVAL);
