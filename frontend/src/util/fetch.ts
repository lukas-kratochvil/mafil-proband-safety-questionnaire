import axiosConfig from "@app/axios-config";
import { trustedOperators } from "@app/data/operator_data";
import { questions } from "@app/data/question_data";
import { dummyVisits } from "@app/data/visit_data";
import { IAuthGateOperator, IOperator } from "@app/interfaces/auth";
import { IQuestionData } from "@app/interfaces/question";
import { ITranslatedEntity, IVisit, VisitState } from "@app/interfaces/visit";
import { GENDERS_QUERY, HANDEDNESSES_QUERY, NATIVE_LANGUAGES_QUERY } from "./server_API/queries";

// TODO: authorize against DB
export const authenticateOperator = async (loggingOperator: IAuthGateOperator): Promise<IOperator | undefined> =>
  trustedOperators.find(
    (op) => op.name === loggingOperator.name && op.surname === loggingOperator.surname && op.uco === loggingOperator.uco
  );

// Fetch genders from DB
export const fetchGenders = async (): Promise<ITranslatedEntity[]> => {
  type GendersResponseType = {
    data: {
      genders: ITranslatedEntity[];
    };
  };
  const response = await axiosConfig.serverApi.post<GendersResponseType>("", { query: GENDERS_QUERY });
  return response.data.data.genders;
};

// Fetch native languages from DB
export const fetchNativeLanguages = async (): Promise<ITranslatedEntity[]> => {
  type NativeLanguagesResponseType = {
    data: {
      nativeLanguages: ITranslatedEntity[];
    };
  };
  const response = await axiosConfig.serverApi.post<NativeLanguagesResponseType>("", { query: NATIVE_LANGUAGES_QUERY });
  return response.data.data.nativeLanguages;
};

// Fetch handedness from DB
export const fetchHandednesses = async (): Promise<ITranslatedEntity[]> => {
  type HandednessesResponseType = {
    data: {
      handednesses: ITranslatedEntity[];
    };
  };
  const response = await axiosConfig.serverApi.post<HandednessesResponseType>("", { query: HANDEDNESSES_QUERY });
  return response.data.data.handednesses;
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

// TODO: get questions from DB
export const fetchCurrentQuestions = async (): Promise<IQuestionData[]> => questions;

// TODO: get question from DB
export const fetchQuestion = async (questionId: string): Promise<IQuestionData | undefined> =>
  questions.find((question) => question.id === questionId);
