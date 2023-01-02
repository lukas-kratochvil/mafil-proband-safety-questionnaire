import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { AdditionalVisitFormInfoEntity } from "@visit-form/entities/additional-visit-form-info.entity";
import { CreateAdditionalVisitFormInfoInput } from "./create-additional-visit-form-info.input";

@InputType()
export class UpdateAdditionalVisitFormInfoInput extends IntersectionType(
  PickType(AdditionalVisitFormInfoEntity, ["id"], InputType),
  PartialType(CreateAdditionalVisitFormInfoInput)
) {}
