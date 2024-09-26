import type { StrictOmit } from "@app/types";
import type { ApprovalRoomTableVisitFormDTO, WaitingRoomTableVisitFormDTO } from "@app/util/server_API/dto";
import type { NativeLanguage } from "./language";
import type { Project } from "./project";

export type WaitingRoomTableVisitForm = StrictOmit<WaitingRoomTableVisitFormDTO, "nativeLanguageCode"> & {
  nativeLanguage: NativeLanguage;
};

export type ApprovalRoomTableVisitForm = StrictOmit<
  ApprovalRoomTableVisitFormDTO,
  "additionalInfo" | "nativeLanguageCode"
> & {
  project: Project;
  nativeLanguage: NativeLanguage;
};
