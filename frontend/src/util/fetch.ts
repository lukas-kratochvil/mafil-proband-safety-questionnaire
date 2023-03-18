import axiosConfig from "@app/axios-config";
import { trustedOperators } from "@app/data/operator_data";
import { dummyVisits } from "@app/data/visit_data";
import { IAuthGateOperator, IOperator } from "@app/interfaces/auth";
import { IVisit, VisitState } from "@app/interfaces/visit";
import { IQuestionEntity, ITranslatedEntity } from "@app/util/server_API/dto";
import {
  CURRENT_QUESTIONS_QUERY,
  GENDERS_QUERY,
  HANDEDNESSES_QUERY,
  NATIVE_LANGUAGES_QUERY,
  QUESTION_QUERY,
} from "./server_API/queries";
import {
  GendersResponse,
  HandednessesResponse,
  NativeLanguagesResponse,
  QuestionResponse,
  QuestionsResponse,
} from "./server_API/response-types";

// TODO: authorize against DB
export const authenticateOperator = async (loggingOperator: IAuthGateOperator): Promise<IOperator | undefined> =>
  trustedOperators.find(
    (op) => op.name === loggingOperator.name && op.surname === loggingOperator.surname && op.uco === loggingOperator.uco
  );

export const fetchGenders = async (): Promise<ITranslatedEntity[]> => {
  const { data } = await axiosConfig.serverApi.post<GendersResponse>("", { query: GENDERS_QUERY });
  return data.data.genders;
};

export const fetchNativeLanguages = async (): Promise<ITranslatedEntity[]> => {
  const { data } = await axiosConfig.serverApi.post<NativeLanguagesResponse>("", { query: NATIVE_LANGUAGES_QUERY });
  return data.data.nativeLanguages;
};

export const fetchHandednesses = async (): Promise<ITranslatedEntity[]> => {
  const { data } = await axiosConfig.serverApi.post<HandednessesResponse>("", { query: HANDEDNESSES_QUERY });
  return data.data.handednesses;
};

export const fetchCurrentQuestions = async (): Promise<IQuestionEntity[]> => {
  const { data } = await axiosConfig.serverApi.post<QuestionsResponse>("", { query: CURRENT_QUESTIONS_QUERY });
  return data.data.questions;
};

export const fetchQuestion = async (questionId: string): Promise<IQuestionEntity> => {
  const variables = { id: questionId };
  const { data } = await axiosConfig.serverApi.post<QuestionResponse>("", { query: QUESTION_QUERY, variables });
  return data.data.question;
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
