import { IQuestionData, questions } from "../data/question_data";
import { dummyVisits, IVisit, VisitState } from "../data/visit_data";

/**
 * TODO: functions in this file must be deleted!
 */

export const getDummyVisit = (visitId: string | undefined): IVisit | undefined =>
  dummyVisits.find((visit) => visit.id === visitId);

export const getDummyVisitCurrentQuestions = (): IQuestionData[] => questions;

export const updateDummyVisitState = (visitId: string | undefined, newState: VisitState): void => {
  const visit = getDummyVisit(visitId);

  if (visit !== undefined) {
    visit.state = newState;
  }
};
