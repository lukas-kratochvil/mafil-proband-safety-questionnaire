import type {
  MDB_IDeviceDTO,
  MDB_ILanguageDTO,
  MDB_IProjectDTO,
  MDB_ISubjectDTO,
  MDB_IVisitDTO,
  MDB_IVisitFileDTO,
} from "./dto";

export const MDB_RESPONSE_ERROR_ATTR = "detail";

type MDB_ErrorResponse = {
  [key in typeof MDB_RESPONSE_ERROR_ATTR]: string;
};

type MDB_GetManySuccessResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Generic MAFILDB API response types
type MDB_GetManyResponse<T> = MDB_GetManySuccessResponse<T> | MDB_ErrorResponse;
type MDB_GetOneResponse<T> = T | MDB_ErrorResponse;

export type MDB_GetLanguagesResponse = MDB_GetManyResponse<MDB_ILanguageDTO>;

export type MDB_GetLanguageResponse = MDB_GetOneResponse<MDB_ILanguageDTO>;

export type MDB_GetProjectsResponse = MDB_GetManyResponse<MDB_IProjectDTO>;

export type MDB_GetProjectResponse = MDB_GetOneResponse<MDB_IProjectDTO>;

export type MDB_GetDevicesResponse = MDB_GetManyResponse<MDB_IDeviceDTO>;

export type MDB_CreateSubjectResponse = MDB_GetOneResponse<MDB_ISubjectDTO>;

export type MDB_CreateVisitResponse = MDB_GetOneResponse<MDB_IVisitDTO>;

export type MDB_UpdateVisitSignatureStateResponse = MDB_GetOneResponse<
  Pick<MDB_IVisitDTO, "registration_signature_status">
>;

export type MDB_GetVisitsResponse = MDB_GetManyResponse<MDB_IVisitDTO>;

export type MDB_GetVisitResponse = MDB_GetOneResponse<MDB_IVisitDTO>;

export type MDB_AddPdfToVisitResponse = MDB_GetOneResponse<
  Pick<MDB_IVisitFileDTO, "id" | "uploaded" | "name" | "file_type" | "mime_type">
>;

export type MDB_GetVisitFilesResponse = MDB_GetManyResponse<MDB_IVisitFileDTO>;
