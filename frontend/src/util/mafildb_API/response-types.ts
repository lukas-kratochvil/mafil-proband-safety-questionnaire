import { IDeviceDTO, IProjectDTO, IVisitDTO, IVisitPdfDTO } from "./dto";

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

export type VisitPdfResponse = {
  file: IVisitPdfDTO;
};
