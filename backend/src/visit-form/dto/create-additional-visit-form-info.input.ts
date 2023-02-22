import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { AdditionalVisitFormInfoEntity } from "@app/visit-form/entities/additional-visit-form-info.entity";

@InputType()
export class CreateAdditionalVisitFormInfoInput extends IntersectionType(
  PickType(AdditionalVisitFormInfoEntity, [
    "projectId",
    "projectAcronym",
    "deviceId",
    "deviceName",
    "isPhantom",
    "measuredAt",
    "finalizerId",
    "finalizedAt",
  ]),
  PartialType(PickType(AdditionalVisitFormInfoEntity, ["approverId", "approvedAt"])),
  InputType
) {}
