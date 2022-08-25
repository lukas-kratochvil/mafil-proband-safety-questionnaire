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
