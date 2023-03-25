import { IDeviceDTO, IProjectDTO } from "./dto";

export type ProjectsResponse = {
  rows: IProjectDTO[];
};

export type DevicesResponse = {
  rows: IDeviceDTO[];
};

export type CreateVisitResponse = {
  visit_name: string;
};

export type UpdateVisitStateResponse = {
  visit_name: string;
};
