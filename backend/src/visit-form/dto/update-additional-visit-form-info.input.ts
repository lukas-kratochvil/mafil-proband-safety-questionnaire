import { InputType, PartialType, PickType } from "@nestjs/graphql";
import { CreateAdditionalVisitFormInfoInput } from "./create-additional-visit-form-info.input";

@InputType()
export class UpdateAdditionalVisitFormInfoInput extends PartialType(
  PickType(CreateAdditionalVisitFormInfoInput, ["projectId", "projectAcronym", "deviceId", "deviceName", "measuredAt"]),
  InputType
) {}
