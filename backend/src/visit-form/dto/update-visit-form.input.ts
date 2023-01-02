import { Field, InputType, PickType } from "@nestjs/graphql";
import { VisitFormEntity } from "@visit-form/entities/visit-form.entity";
import { UpdateAdditionalVisitFormInfoInput } from "./update-additional-visit-form-info.input";
import { UpdateAnswerInput } from "./update-answer.input";
import { UpdateProbandInfoInput } from "./update-proband-info.input";

@InputType()
export class UpdateVisitFormInput extends PickType(VisitFormEntity, ["id", "state"], InputType) {
  @Field(() => UpdateAdditionalVisitFormInfoInput, { nullable: true })
  additionalInfo: UpdateAdditionalVisitFormInfoInput | null;

  @Field(() => UpdateProbandInfoInput, { nullable: true })
  probandInfo: UpdateProbandInfoInput | null;

  @Field(() => [UpdateAnswerInput], { nullable: true })
  answers: UpdateAnswerInput[] | null;
}
