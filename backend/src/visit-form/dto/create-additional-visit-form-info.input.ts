import { InputType, PickType } from "@nestjs/graphql";
import { AdditionalVisitFormInfoEntity } from "@app/visit-form/entities/additional-visit-form-info.entity";

@InputType()
export class CreateAdditionalVisitFormInfoInput extends PickType(
  AdditionalVisitFormInfoEntity,
  ["projectId", "projectAcronym", "deviceId", "deviceName", "measuredAt", "finalizerId", "finalizedAt"],
  InputType
) {}
