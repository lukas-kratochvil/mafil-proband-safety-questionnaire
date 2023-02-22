import { Field, InputType } from "@nestjs/graphql";
import { UuidScalar } from "@app/graphql/scalars/uuid-scalar";
import { CreateAdditionalVisitFormInfoInput } from "@app/visit-form/dto/create-additional-visit-form-info.input";
import { CreateAnswerInput } from "@app/visit-form/dto/create-answer.input";
import { CreateProbandInfoInput } from "@app/visit-form/dto/create-proband-info.input";

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
