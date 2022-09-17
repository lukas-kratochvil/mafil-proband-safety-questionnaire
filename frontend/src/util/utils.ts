import { IQuestionData, questions } from "../data/question_data";
import { dummyVisits, IQac, IVisit, VisitState } from "../data/visit_data";

// TODO: get visits from DB
export const fetchVisit = async (visitId: string | undefined): Promise<IVisit | undefined> =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: get visits from DB
export const fetchWaitingRoomVisits = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) => [VisitState.NEW, VisitState.FANTOM_NEW].includes(visit.state));

// TODO: get visits from DB
export const fetchRecentVisits = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) => [VisitState.CHECKED, VisitState.SIGNED, VisitState.FANTOM_DONE].includes(visit.state));

// TODO: get questions from DB
export const fetchCurrentQuestions = async (): Promise<IQuestionData[]> => questions;

// TODO: get questions from DB
export const fetchAnswerQuestions = async (answers: IQac[]): Promise<IQuestionData[]> =>
  answers.map((answer) => questions.filter((question) => question.id === answer.questionId)[0]);

// TODO: get question from DB
export const fetchQuestion = async (questionId: string): Promise<IQuestionData | undefined> =>
  questions.find((question) => question.id === questionId);
