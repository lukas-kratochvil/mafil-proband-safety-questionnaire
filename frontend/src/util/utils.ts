import { IQuestionData, questions1, questions2 } from "../data/form_data";
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
export const fetchCurrentQuestionsPart1 = (): IQuestionData[] => questions1.filter((question) => question.isValid);

// TODO: get questions from DB
export const fetchCurrentQuestionsPart2 = (): IQuestionData[] => questions2.filter((question) => question.isValid);

// TODO: get question from DB
export const fetchQuestion = (questionId: string): IQuestionData | undefined =>
  questions1.find((question) => question.id === questionId) ??
  questions2.find((question) => question.id === questionId);
