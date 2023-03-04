import { trustedOperators } from "@app/data/operator_data";
import { questions } from "@app/data/question_data";
import { dummyVisits } from "@app/data/visit_data";
import { IAuthGateOperator, IOperator } from "@app/interfaces/auth";
import { IQuestionData } from "@app/interfaces/question";
import { IQac, IVisit, VisitState } from "@app/interfaces/visit";

// TODO: authorize against DB
export const authenticateOperator = async (loggingOperator: IAuthGateOperator): Promise<IOperator | undefined> =>
  trustedOperators.find(
    (op) => op.name === loggingOperator.name && op.surname === loggingOperator.surname && op.uco === loggingOperator.uco
  );

// TODO: get visits from DB
export const fetchVisitForm = async (visitId: string | undefined): Promise<IVisit | undefined> =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: get visits from DB
export const fetchWaitingRoomVisits = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) => visit.state === VisitState.NEW);

// TODO: get visits from DB
export const fetchApprovalRoomVisits = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) => visit.state === VisitState.IN_APPROVAL);

// TODO: get questions from DB
export const fetchCurrentQuestions = async (): Promise<IQuestionData[]> => questions;

// TODO: get questions from DB
export const fetchAnswerQuestions = async (answers: IQac[]): Promise<IQuestionData[]> =>
  answers.map((answer) => questions.filter((question) => question.id === answer.questionId)[0]);

// TODO: get question from DB
export const fetchQuestion = async (questionId: string): Promise<IQuestionData | undefined> =>
  questions.find((question) => question.id === questionId);
