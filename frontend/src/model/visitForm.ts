import { IApprovalRoomTableVisitFormDTO } from "@app/util/server_API/dto";
import { IProject } from "./project";

export enum VisualCorrection {
  YES,
  NO,
}

export interface IApprovalRoomTableVisitForm
  extends Omit<IApprovalRoomTableVisitFormDTO, "additionalInfo"> {
  project: IProject;
}
