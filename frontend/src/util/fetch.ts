import { devicesDev, projectsDev } from "@data/form_data";
import { trustedOperators } from "@data/operator_data";
import { questions } from "@data/question_data";
import { dummyVisits } from "@data/visit_data";
import { IAuthGateOperator, IOperator } from "@interfaces/auth";
import { IQuestionData } from "@interfaces/question";
import { IQac, IVisit, VisitState } from "@interfaces/visit";

// TODO: authorize against DB
export const authenticateOperator = async (loggingOperator: IAuthGateOperator): Promise<IOperator | undefined> =>
  trustedOperators.find(
    (op) => op.name === loggingOperator.name && op.surname === loggingOperator.surname && op.uco === loggingOperator.uco
  );

// TODO: get visits from DB
export const fetchVisit = async (visitId: string | undefined): Promise<IVisit | undefined> =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: get visits from MAFILDB
export const fetchVisitDetail = async (visitId: string | undefined): Promise<IVisit | undefined> =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: get visits from DB
export const fetchWaitingRoomVisits = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) => visit.state === VisitState.NEW);

// TODO: get visits from DB
export const fetchApprovalRoomVisits = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) => visit.state === VisitState.IN_APPROVAL);

// TODO: get visits from MAFIL DB – all the visits with assigned visitId and generated PDF are fetched from MAFIL DB
export const fetchRecentVisits = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) =>
    [VisitState.APPROVED, VisitState.DISAPPROVED, VisitState.FOR_SIGNATURE, VisitState.SIGNED].includes(visit.state)
  );

// TODO: get questions from DB
export const fetchCurrentQuestions = async (): Promise<IQuestionData[]> => questions;

// TODO: get questions from DB
export const fetchAnswerQuestions = async (answers: IQac[]): Promise<IQuestionData[]> =>
  answers.map((answer) => questions.filter((question) => question.id === answer.questionId)[0]);

// TODO: get question from DB
export const fetchQuestion = async (questionId: string): Promise<IQuestionData | undefined> =>
  questions.find((question) => question.id === questionId);

// TODO: get projects from MAFILDB
export const fetchProjects = async (): Promise<string[]> => projectsDev;

// TODO: get devices from MAFILDB
export const fetchDevices = async (): Promise<string[]> => devicesDev;
