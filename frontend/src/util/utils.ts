import { IQuestionData, questions } from "../data/question_data";
import { dummyVisits, IProbandVisit, VisitState } from "../data/visit_data";

export const fetchVisit = (visitId: string): IProbandVisit | undefined =>
  // TODO: get visits from DB
  dummyVisits.find((visit) => visit.id === visitId);

export const fetchWaitingRoomVisits = (): IProbandVisit[] =>
  // TODO: get visits from DB
  dummyVisits.filter((visit) => visit.state === VisitState.NEW);

export const fetchRecentVisits = (): IProbandVisit[] =>
  // TODO: get visits from DB
  dummyVisits.filter((visit) => [VisitState.CHECKED, VisitState.SIGNED, VisitState.FANTOM_DONE].includes(visit.state));

// TODO: get questions from DB
export const fetchCurrentQuestionsPart1 = (): IQuestionData[] =>
  questions.filter((question) => question.partNumber === 1 && question.isValid);

// TODO: get questions from DB
export const fetchCurrentQuestionsPart2 = (): IQuestionData[] =>
  questions.filter((question) => question.partNumber === 2 && question.isValid);

// TODO: get question from DB
export const fetchQuestion = (questionId: string): IQuestionData | undefined =>
  questions.find((question) => question.id === questionId);
