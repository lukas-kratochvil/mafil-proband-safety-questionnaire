import { Field, InputType, PickType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@language/dto/create-translation.input";
import { QuestionEntity } from "@question/entities/question.entity";

@InputType()
export class CreateQuestionInput extends PickType(QuestionEntity, ["partNumber"], InputType) {
  @Field(() => [CreateTranslationInput])
  translations: CreateTranslationInput[];
}
