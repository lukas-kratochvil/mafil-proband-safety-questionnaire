import { InputType, PartialType } from "@nestjs/graphql";
import { CreateAdditionalVisitFormInfoInput } from "./create-additional-visit-form-info.input";

@InputType()
export class UpdateAdditionalVisitFormInfoInput extends PartialType(CreateAdditionalVisitFormInfoInput, InputType) {}
