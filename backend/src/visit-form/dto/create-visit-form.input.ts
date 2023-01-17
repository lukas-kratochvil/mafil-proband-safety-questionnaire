import { Field, InputType } from "@nestjs/graphql";
import { UuidScalar } from "@graphql/scalars/uuid-scalar";
import { CreateAdditionalVisitFormInfoInput } from "@visit-form/dto/create-additional-visit-form-info.input";
import { CreateAnswerInput } from "@visit-form/dto/create-answer.input";
import { CreateProbandInfoInput } from "@visit-form/dto/create-proband-info.input";

@InputType()
export class CreateVisitFormInput {
  @Field(() => UuidScalar)
  probandLanguageId: string;

  @Field(() => CreateAdditionalVisitFormInfoInput, { nullable: true })
  additionalInfo: CreateAdditionalVisitFormInfoInput | null;

  @Field(() => CreateProbandInfoInput)
  probandInfo: CreateProbandInfoInput;

  @Field(() => [CreateAnswerInput])
  answers: CreateAnswerInput[];
}
