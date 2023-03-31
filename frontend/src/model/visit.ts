import { IGenderDTO, IHandednessDTO, INativeLanguageDTO } from "../util/server_API/dto";
import { FormAnswer } from "./form";

export enum VisitStateDEV {
  NEW = "Nové",
  IN_APPROVAL = "Ve schvalování",
  APPROVED = "Schváleno, nepodepsáno",
  DISAPPROVED = "Neschváleno",
  FOR_SIGNATURE = "K podpisu",
  SIGNED = "Podepsáno",
  DELETED = "Smazáno",
}

export interface IVisit {
  id: string;
  createdAt: Date;
  visitId: string;
  state: VisitStateDEV;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  heightCm: number;
  weightKg: number;
  gender: IGenderDTO;
  nativeLanguage: INativeLanguageDTO;
  visualCorrection: VisualCorrection;
  visualCorrectionDioptre: number;
  handedness: IHandednessDTO;
  email: string;
  phone: string;
  pdf: string;
  projectInfo: IProjectInfo;
  answers: FormAnswer[];
}

interface IProjectInfo {
  projectId: string | null;
  projectAcronym: string | null;
  deviceId: string | null;
  deviceName: string | null;
  isPhantom: boolean;
  measuredAt: Date | null;
  disapprovalReason: string | null;
}

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
}

export enum VisualCorrection {
  YES,
  NO,
}

export enum Handedness {
  RIGHT_HANDED,
  LEFT_HANDED,
  LEFT_HANDED_RETRAINED,
  UNDETERMINED,
}
