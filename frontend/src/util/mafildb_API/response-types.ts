import { IDeviceDTO, IProjectDTO, IVisitDTO, IVisitPdfDTO } from "./dto";

// TODO: correct MAFILDB response types

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

export type VisitsResponse = {
  rows: IVisitDTO[];
};

export type AddPdfToVisitResponse = {
  file_id: string;
};

export type VisitPdfResponse = {
  file: IVisitPdfDTO;
};
