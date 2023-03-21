import { Field, InputType } from "@nestjs/graphql";
import { CreateAdditionalVisitFormInfoInput } from "@app/visit-form/dto/create-additional-visit-form-info.input";
import { CreateAnswerInput } from "@app/visit-form/dto/create-answer.input";
import { CreateProbandInfoInput } from "@app/visit-form/dto/create-proband-info.input";

@InputType()
export class CreateVisitFormInput {
  @Field()
  probandLanguageCode: string;

  // additionalInfo object is used when creating Phantom visit form
  @Field(() => CreateAdditionalVisitFormInfoInput, { nullable: true })
  additionalInfo: CreateAdditionalVisitFormInfoInput | null;

  @Field(() => CreateProbandInfoInput)
  probandInfo: CreateProbandInfoInput;

  @Field(() => [CreateAnswerInput])
  answers: CreateAnswerInput[];
}
