import { questions } from "@app/data/question_data";
import { dummyVisits } from "@app/data/visit_data";
import { IQuestionData } from "@app/model/question";
import { IVisit, VisitStateDEV } from "@app/model/visit";

/**
 * TODO: functions in this file must be deleted!
 */

export const getDummyVisit = (visitId: string | undefined): IVisit | undefined =>
  dummyVisits.find((visit) => visit.id === visitId);

export const getDummyVisitCurrentQuestions = (): IQuestionData[] => questions;

export const updateDummyVisitState = (visitId: string | undefined, newState: VisitStateDEV): void => {
  const visit = getDummyVisit(visitId);

  if (visit !== undefined) {
    visit.state = newState;
  }
};
