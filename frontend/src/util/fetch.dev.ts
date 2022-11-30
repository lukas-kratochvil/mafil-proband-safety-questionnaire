import { questions } from "@data/question_data";
import { dummyVisits } from "@data/visit_data";
import { IQuestionData } from "@interfaces/question";
import { IVisit, VisitState } from "@interfaces/visit";

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
