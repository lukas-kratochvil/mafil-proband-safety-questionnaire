import { Field, InputType } from "@nestjs/graphql";
import { VisitFormState } from "@prisma/client";
import { CreateAdditionalVisitFormInfoInput } from "@app/visit-form/dto/create-additional-visit-form-info.input";
import { CreateAnswerInput } from "@app/visit-form/dto/create-answer.input";
import { CreateProbandInfoInput } from "@app/visit-form/dto/create-proband-info.input";

@InputType()
export class CreateVisitFormInput {
  @Field()
  probandLanguageCode: string;

  @Field(() => CreateProbandInfoInput)
  probandInfo: CreateProbandInfoInput;

  @Field(() => [CreateAnswerInput])
  answers: CreateAnswerInput[];

  // additionalInfo is created for a duplicated visit that is going to be approved
  @Field(() => CreateAdditionalVisitFormInfoInput, { nullable: true })
  additionalInfo: CreateAdditionalVisitFormInfoInput | null;

  // state is IN_APPROVAL for a duplicated visit that is going to be approved
  @Field(() => VisitFormState, { nullable: true })
  state: VisitFormState | null;
}
