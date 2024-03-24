import type { IApprovalRoomTableVisitFormDTO, IWaitingRoomTableVisitFormDTO } from "@app/util/server_API/dto";
import type { INativeLanguage } from "./language";
import type { IProject } from "./project";

export enum VisualCorrection {
  YES,
  NO,
}

export interface IWaitingRoomTableVisitForm extends Omit<IWaitingRoomTableVisitFormDTO, "nativeLanguageCode"> {
  nativeLanguage: INativeLanguage;
}

export interface IApprovalRoomTableVisitForm
  extends Omit<IApprovalRoomTableVisitFormDTO, "additionalInfo" | "nativeLanguageCode"> {
  project: IProject;
  nativeLanguage: INativeLanguage;
}
