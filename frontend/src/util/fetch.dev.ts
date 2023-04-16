import { IQuestionDataDev, questions } from "@app/data/question_data";
import { dummyVisits } from "@app/data/visit_data";
import { VisitStateDEV } from "@app/model/visit";

/**
 * TODO: functions in this file must be deleted!
 */

export const getDummyVisitCurrentQuestions = (): IQuestionDataDev[] => questions;

export const updateDummyVisitState = (visitId: string | undefined, newState: VisitStateDEV): void => {
  const visit = dummyVisits.find((visit) => visit.id === visitId);

  if (visit !== undefined) {
    visit.state = newState;
  }
};
