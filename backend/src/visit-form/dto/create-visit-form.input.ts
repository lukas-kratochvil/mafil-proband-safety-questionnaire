import { Field, InputType, PickType } from "@nestjs/graphql";
import { UuidScalar } from "@graphql/scalars/uuid-scalar";
import { CreateAdditionalVisitFormInfoInput } from "@visit-form/dto/create-additional-visit-form-info.input";
import { CreateAnswerInput } from "@visit-form/dto/create-answer.input";
import { CreateProbandInfoInput } from "@visit-form/dto/create-proband-info.input";
import { VisitFormEntity } from "@visit-form/entities/visit-form.entity";

@InputType()
export class CreateVisitFormInput extends PickType(VisitFormEntity, ["state"]) {
  @Field(() => UuidScalar)
  probandLanguageId: string;

  @Field(() => CreateAdditionalVisitFormInfoInput, { nullable: true })
  additionalInfo: CreateAdditionalVisitFormInfoInput | null;

  @Field(() => CreateProbandInfoInput)
  probandInfo: CreateProbandInfoInput;

  @Field(() => [CreateAnswerInput])
  answers: CreateAnswerInput[];
}
