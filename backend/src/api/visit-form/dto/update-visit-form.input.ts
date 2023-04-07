import { Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { IsArray, IsInstance, IsOptional } from "class-validator";
import { VisitFormEntity } from "@app/api/visit-form/entities/visit-form.entity";
import { CreateVisitFormInput } from "./create-visit-form.input";
import { UpdateAdditionalVisitFormInfoInput } from "./update-additional-visit-form-info.input";
import { UpdateAnswerInput } from "./update-answer.input";

@InputType()
export class UpdateVisitFormInput extends IntersectionType(
  PickType(VisitFormEntity, ["id"] as const),
  PartialType(
    PickType(CreateVisitFormInput, [
      "state",
      "genderId",
      "nativeLanguageId",
      "handednessId",
      "name",
      "surname",
      "personalId",
      "birthdate",
      "heightCm",
      "weightKg",
      "visualCorrectionDioptre",
      "email",
      "phone",
    ] as const)
  ),
  InputType
) {
  @Field(() => UpdateAdditionalVisitFormInfoInput, { nullable: true })
  @IsOptional()
  @IsInstance(UpdateAdditionalVisitFormInfoInput)
  additionalInfo?: UpdateAdditionalVisitFormInfoInput;

  @Field(() => [UpdateAnswerInput], { nullable: true })
  @IsOptional()
  @IsArray()
  answers?: UpdateAnswerInput[];
}
