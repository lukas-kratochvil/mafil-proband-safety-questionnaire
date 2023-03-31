import { Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { VisitFormEntity } from "@app/api/visit-form/entities/visit-form.entity";
import { CreateVisitFormInput } from "./create-visit-form.input";
import { UpdateAdditionalVisitFormInfoInput } from "./update-additional-visit-form-info.input";
import { UpdateAnswerInput } from "./update-answer.input";

@InputType()
export class UpdateVisitFormInput extends IntersectionType(
  PickType(VisitFormEntity, ["id"]),
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
    ])
  ),
  InputType
) {
  @Field(() => UpdateAdditionalVisitFormInfoInput, { nullable: true })
  additionalInfo?: UpdateAdditionalVisitFormInfoInput;

  @Field(() => [UpdateAnswerInput], { nullable: true })
  answers?: UpdateAnswerInput[];
}
