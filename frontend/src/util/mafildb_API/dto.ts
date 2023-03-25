export interface IProjectDTO {
  id: string;
  acronym: string;
  name: string | null;
}

export interface IDeviceDTO {
  id: string;
  name: string;
}

export type VisitState =
  | "PHANTOM_DONE"
  | "DISAPPROVED"
  | "APPROVED"
  | "FOR_SIGNATURE_PHYSICALLY"
  | "FOR_SIGNATURE_ELECTRONICALLY"
  | "SIGNED_PHYSICALLY"
  | "SIGNED_ELECTRONICALLY";
