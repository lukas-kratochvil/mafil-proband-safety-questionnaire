import { IQuestionData, QuestionPartNumber, questions } from "../data/question_data";
import { dummyVisits, IProbandVisit, VisitState } from "../data/visit_data";

export const fetchVisit = async (visitId?: string): Promise<IProbandVisit | undefined> =>
  // TODO: get visits from DB
  dummyVisits.find((visit) => visit.id === visitId);

export const fetchWaitingRoomVisits = async (): Promise<IProbandVisit[]> =>
  // TODO: get visits from DB
  dummyVisits.filter((visit) => [VisitState.NEW, VisitState.FANTOM_NEW].includes(visit.state));

export const fetchRecentVisits = async (): Promise<IProbandVisit[]> =>
  // TODO: get visits from DB
  dummyVisits.filter((visit) => [VisitState.CHECKED, VisitState.SIGNED, VisitState.FANTOM_DONE].includes(visit.state));

// TODO: get questions from DB
export const fetchCurrentQuestions = async (partNumber: QuestionPartNumber): Promise<IQuestionData[]> =>
  questions.filter((question) => question.partNumber === partNumber && question.isValid);

// TODO: delete this method
export const getDummyVisitCurrentQuestions = (partNumber: QuestionPartNumber): IQuestionData[] =>
  questions.filter((question) => question.partNumber === partNumber && question.isValid);

// TODO: get question from DB
export const fetchQuestion = async (questionId: string): Promise<IQuestionData | undefined> =>
  questions.find((question) => question.id === questionId);
