import { IDeviceDTO, IProjectDTO, ISubjectDTO, IVisitDTO, IVisitFileDTO } from "./dto";

// TODO: correct MAFILDB response types

export const MAFILDB_RESPONSE_ERROR_ATTR = "detail";

type MafildbErrorResponse = {
  [key in typeof MAFILDB_RESPONSE_ERROR_ATTR]: string;
};

type MafildbGetManySuccessResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Generic MAFILDB API response types
type MafildbGetManyResponse<T> = MafildbGetManySuccessResponse<T> | MafildbErrorResponse;
type MafildbGetOneResponse<T> = T | MafildbErrorResponse;

export type GetProjectsResponse = MafildbGetManyResponse<IProjectDTO>;

export type GetDevicesResponse = MafildbGetManyResponse<IDeviceDTO>;

export type CreateSubjectResponse = MafildbGetOneResponse<ISubjectDTO>;

export type CreateVisitResponse = {
  visit_name: string;
};

export type UpdateVisitSignatureStateResponse = MafildbGetOneResponse<Pick<IVisitDTO, "registration_signature_status">>;

export type GetVisitsResponse = MafildbGetManyResponse<IVisitDTO>;

export type GetVisitResponse = MafildbGetOneResponse<IVisitDTO>;

export type AddPdfToVisitResponse = MafildbGetOneResponse<
  Pick<IVisitFileDTO, "id" | "uploaded" | "name" | "file_type" | "mime_type">
>;

export type GetVisitFilesResponse = MafildbGetManyResponse<IVisitFileDTO>;
