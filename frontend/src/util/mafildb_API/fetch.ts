import axiosConfig from "@app/axios-config";
import { dummyVisits } from "@app/data/visit_data";
import { FormPropType } from "@app/interfaces/form";
import { IVisit, VisitStateDEV } from "@app/interfaces/visit";
import { IDeviceDTO, IProjectDTO, VisitState } from "./dto";
import { CreateVisitResponse, DevicesResponse, ProjectsResponse, UpdateVisitStateResponse } from "./response-types";

export const fetchProjects = async (): Promise<IProjectDTO[]> => {
  const { data } = await axiosConfig.mafildbApi.get<ProjectsResponse>("projects.json");
  return data.rows;
};

export const fetchDevices = async (): Promise<IDeviceDTO[]> => {
  const { data } = await axiosConfig.mafildbApi.get<DevicesResponse>("devices.json");
  return data.rows;
};

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

// TODO: create visit in MAFILDB
export const createVisit = async (visitFormData: FormPropType, state: VisitState): Promise<string | undefined> => {
  const createData = {
    ...visitFormData,
    state,
  };
  const { data } = await axiosConfig.mafildbApi.post<CreateVisitResponse>("visit", createData);
  return data.visit_name;
};

// TODO: update visit state in MAFILDB
export const updateVisitState = async (visitId: string, state: VisitState): Promise<string | undefined> => {
  const updateData = { state };
  const { data } = await axiosConfig.mafildbApi.patch<UpdateVisitStateResponse>(`visit/${visitId}`, updateData);
  return data.visit_name;
};
