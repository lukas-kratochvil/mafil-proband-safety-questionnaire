import { IDeviceDTO, IProjectDTO, ISubjectDTO, IVisitDTO, IVisitFileDTO } from "./dto";

// TODO: correct MAFILDB response types

export const MAFILDB_RESPONSE_ERROR_ATTR = "detail";

type MafildbErrorResponse = {
  [key in typeof MAFILDB_RESPONSE_ERROR_ATTR]: string;
};

type MafildbGetSuccessResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Generic MAFILDB API response types
type MafildbGetManyResponse<T> = MafildbGetSuccessResponse<T> | MafildbErrorResponse;
type MafildbGetOneResponse<T> = T | MafildbErrorResponse;

export type ProjectsResponse = MafildbGetManyResponse<IProjectDTO>;

export type DevicesResponse = MafildbGetManyResponse<IDeviceDTO>;

export type CreateSubjectResponse = MafildbGetOneResponse<ISubjectDTO>;

export type CreateVisitResponse = {
  visit_name: string;
};

export type UpdateVisitStateResponse = {
  visit_name: string;
};

export type VisitsResponse = MafildbGetManyResponse<IVisitDTO>;

export type VisitResponse = MafildbGetOneResponse<IVisitDTO>;

export type AddPdfToVisitResponse = MafildbGetOneResponse<
  Pick<IVisitFileDTO, "id" | "uploaded" | "name" | "file_type" | "mime_type">
>;

export type VisitFilesResponse = MafildbGetManyResponse<IVisitFileDTO>;
