import { devicesDev, projectsDev } from "@app/data/form_data";
import { dummyVisits } from "@app/data/visit_data";
import { IVisit, VisitState } from "@app/interfaces/visit";
import { IDeviceEntity, IProjectEntity } from "./mafildb_API/dto";

// TODO: get projects from MAFILDB
export const fetchProjects = async (): Promise<IProjectEntity[]> => projectsDev;

// TODO: get devices from MAFILDB
export const fetchDevices = async (): Promise<IDeviceEntity[]> => devicesDev;

// TODO: get visit from MAFILDB DB
export const fetchVisit = async (visitId: string | undefined): Promise<IVisit | undefined> =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: get visits from MAFILDB
export const fetchVisitDetail = async (visitId: string | undefined): Promise<IVisit | undefined> =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: get visits from MAFIL DB – all the visits with assigned visitId and generated PDF are fetched from MAFIL DB
export const fetchRecentVisits = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) =>
    [VisitState.APPROVED, VisitState.DISAPPROVED, VisitState.FOR_SIGNATURE, VisitState.SIGNED].includes(visit.state)
  );
