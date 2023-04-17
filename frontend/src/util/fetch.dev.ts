import { IQuestionDataDev, questions } from "@app/data/question_data";
import { dummyVisits } from "./mafildb_API/data.dev";
import { VisitState } from "./mafildb_API/dto";

/**
 * TODO: functions in this file must be deleted!
 */

export const getDummyVisitCurrentQuestions = (): IQuestionDataDev[] => questions;

export const updateDummyVisitState = (visitId: string | undefined, newState: VisitState): void => {
  const visit = dummyVisits.find((dummyVisit) => dummyVisit.visit_name === visitId);

  if (visit !== undefined) {
    visit.state = newState;
  }
};
