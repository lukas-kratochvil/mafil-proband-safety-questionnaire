import type { ApprovalRoomTableVisitFormDTO, WaitingRoomTableVisitFormDTO } from "@app/util/server_API/dto";
import type { NativeLanguage } from "./language";
import type { Project } from "./project";

export type WaitingRoomTableVisitForm = Omit<WaitingRoomTableVisitFormDTO, "nativeLanguageCode"> & {
  nativeLanguage: NativeLanguage;
};

export type ApprovalRoomTableVisitForm = Omit<
  ApprovalRoomTableVisitFormDTO,
  "additionalInfo" | "nativeLanguageCode"
> & {
  project: Project;
  nativeLanguage: NativeLanguage;
};
