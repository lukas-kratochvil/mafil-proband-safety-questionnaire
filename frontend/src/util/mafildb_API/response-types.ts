import { IAddPdfToVisitInput, IDeviceDTO, IProjectDTO, IVisitDTO, IVisitFileDTO } from "./dto";

// TODO: correct MAFILDB response types

export type ProjectsResponse = {
  results: IProjectDTO[];
};

export type DevicesResponse = {
  results: IDeviceDTO[];
};

export type CreateVisitResponse = {
  visit_name: string;
};

export type UpdateVisitStateResponse = {
  visit_name: string;
};

export type VisitsResponse = {
  results: IVisitDTO[];
};

export type AddPdfToVisitResponse = Pick<IAddPdfToVisitInput, "name" | "file_type" | "mime_type"> & {
  id: string;
  updated: Date;
};

export type VisitFilesResponse = {
  files: IVisitFileDTO[];
};
