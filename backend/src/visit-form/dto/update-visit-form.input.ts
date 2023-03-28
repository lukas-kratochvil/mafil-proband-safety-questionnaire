import { Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { VisitFormEntity } from "@app/visit-form/entities/visit-form.entity";
import { UpdateAdditionalVisitFormInfoInput } from "./update-additional-visit-form-info.input";
import { UpdateAnswerInput } from "./update-answer.input";
import { UpdateProbandInfoInput } from "./update-proband-info.input";

@InputType()
export class UpdateVisitFormInput extends IntersectionType(
  PickType(VisitFormEntity, ["id"]),
  PartialType(PickType(VisitFormEntity, ["state"])),
  InputType
) {
  @Field(() => UpdateAdditionalVisitFormInfoInput, { nullable: true })
  additionalInfo?: UpdateAdditionalVisitFormInfoInput;

  @Field(() => UpdateProbandInfoInput, { nullable: true })
  probandInfo?: UpdateProbandInfoInput;

  @Field(() => [UpdateAnswerInput], { nullable: true })
  answers?: UpdateAnswerInput[];
}
