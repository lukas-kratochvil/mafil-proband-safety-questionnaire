import type { IApprovalRoomTableVisitFormDTO, IWaitingRoomTableVisitFormDTO } from "@app/util/server_API/dto";
import type { INativeLanguage } from "./language";
import type { IProject } from "./project";

export type IWaitingRoomTableVisitForm = Omit<IWaitingRoomTableVisitFormDTO, "nativeLanguageCode"> & {
  nativeLanguage: INativeLanguage;
};

export type IApprovalRoomTableVisitForm = Omit<
  IApprovalRoomTableVisitFormDTO,
  "additionalInfo" | "nativeLanguageCode"
> & {
  project: IProject;
  nativeLanguage: INativeLanguage;
};
