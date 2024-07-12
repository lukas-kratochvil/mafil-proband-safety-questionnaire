import type {
  MDB_DeviceDTO,
  MDB_LanguageDTO,
  MDB_ProjectDTO,
  MDB_SubjectDTO,
  MDB_VisitDTO,
  MDB_VisitFileDTO,
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
type MDB_GetResponse<T> = T | MDB_ErrorResponse;
type MDB_GetResponseComplex<T> = MDB_GetManySuccessResponse<T> | MDB_ErrorResponse;

export type MDB_GetLanguagesResponse = MDB_GetResponseComplex<MDB_LanguageDTO>;

export type MDB_GetLanguageResponse = MDB_GetResponse<MDB_LanguageDTO>;

export type MDB_GetProjectsResponse = MDB_GetResponseComplex<MDB_ProjectDTO>;

export type MDB_GetProjectResponse = MDB_GetResponse<MDB_ProjectDTO>;

export type MDB_GetDevicesResponse = MDB_GetResponseComplex<MDB_DeviceDTO>;

export type MDB_GetDeviceResponse = MDB_GetResponse<MDB_DeviceDTO>;

export type MDB_CreateSubjectResponse = MDB_GetResponse<MDB_SubjectDTO>;

export type MDB_CreateVisitResponse = MDB_GetResponse<MDB_VisitDTO>;

export type MDB_UpdateVisitSignatureStateResponse = MDB_GetResponse<
  Pick<MDB_VisitDTO, "registration_signature_status">
>;

export type MDB_GetVisitsResponse = MDB_GetResponseComplex<MDB_VisitDTO>;

export type MDB_GetVisitResponse = MDB_GetResponse<MDB_VisitDTO>;

export type MDB_AddPdfToVisitResponse = MDB_GetResponse<
  Pick<MDB_VisitFileDTO, "id" | "uploaded" | "name" | "file_type" | "mime_type">
>;

export type MDB_GetVisitFilesResponse = MDB_GetResponse<MDB_VisitFileDTO[]>;
