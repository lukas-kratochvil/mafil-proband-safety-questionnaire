import axiosConfig from "@app/axios-config";
import { devicesDev } from "@app/data/form_data";
import { dummyVisits } from "@app/data/visit_data";
import { IVisit, VisitStateDEV } from "@app/interfaces/visit";
import { IDeviceDTO, IProjectDTO } from "./dto";
import { ProjectsResponse } from "./response-types";

export const fetchProjects = async (): Promise<IProjectDTO[]> => {
  const { data } = await axiosConfig.mafildbApi.get<ProjectsResponse>("projects.json");
  return data.data.rows;
};

// TODO: get devices from MAFILDB
export const fetchDevices = async (): Promise<IDeviceDTO[]> => devicesDev;

// TODO: get visit from MAFILDB DB
export const fetchVisit = async (visitId: string | undefined): Promise<IVisit | undefined> =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: get visits from MAFILDB
export const fetchVisitDetail = async (visitId: string | undefined): Promise<IVisit | undefined> =>
  dummyVisits.find((visit) => visit.id === visitId);

// TODO: get visits from MAFIL DB – all the visits with assigned visitId and generated PDF are fetched from MAFIL DB
export const fetchRecentVisits = async (): Promise<IVisit[]> =>
  dummyVisits.filter((visit) =>
    [VisitStateDEV.APPROVED, VisitStateDEV.DISAPPROVED, VisitStateDEV.FOR_SIGNATURE, VisitStateDEV.SIGNED].includes(
      visit.state
    )
  );
