import { InputType, PickType } from "@nestjs/graphql";
import { AdditionalVisitFormInfoEntity } from "@app/api/visit-form/entities/additional-visit-form-info.entity";

@InputType()
export class CreateAdditionalVisitFormInfoInput extends PickType(
  AdditionalVisitFormInfoEntity,
  ["projectUuid", "deviceId", "measuredAt", "finalizerId", "finalizedAt"] as const,
  InputType
) {}
