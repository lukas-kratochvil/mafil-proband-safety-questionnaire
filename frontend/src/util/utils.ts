import { IQuestionData, QuestionPartNumber, questions } from "../data/question_data";
import { dummyVisits, IProbandVisit, VisitState } from "../data/visit_data";

// TODO: get visits from DB
export const fetchVisit = async (visitId: string | undefined): Promise<IProbandVisit | undefined> =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: get visits from DB
export const fetchWaitingRoomVisits = async (): Promise<IProbandVisit[]> =>
  dummyVisits.filter((visit) => [VisitState.NEW, VisitState.FANTOM_NEW].includes(visit.state));

// TODO: get visits from DB
export const fetchRecentVisits = async (): Promise<IProbandVisit[]> =>
  dummyVisits.filter((visit) => [VisitState.CHECKED, VisitState.SIGNED, VisitState.FANTOM_DONE].includes(visit.state));

// TODO: get questions from DB
export const fetchCurrentQuestions = async (partNumber: QuestionPartNumber): Promise<IQuestionData[]> =>
  questions.filter((question) => question.partNumber === partNumber && question.isValid);

// TODO: get question from DB
export const fetchQuestion = async (questionId: string): Promise<IQuestionData | undefined> =>
  questions.find((question) => question.id === questionId);

/**
 * TODO: functions below must be deleted!
 */

// TODO: get visits from DB
export const getDummyVisit = (visitId: string | undefined): IProbandVisit | undefined =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: delete this method
export const getDummyVisitCurrentQuestions = (partNumber: QuestionPartNumber): IQuestionData[] =>
  questions.filter((question) => question.partNumber === partNumber && question.isValid);

export const updateDummyVisitState = (visitId: string | undefined, newState: VisitState): void => {
  const visit = getDummyVisit(visitId);

  if (visit !== undefined) {
    visit.state = newState;
  }
};
