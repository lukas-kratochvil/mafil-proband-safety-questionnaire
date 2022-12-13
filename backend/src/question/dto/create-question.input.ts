import { Field, InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { LanguageEntity } from "@language/entities/language.entity";
import { QuestionTranslationEntity } from "@question-translation/entities/question-translation.entity";
import { QuestionEntity } from "@question/entities/question.entity";

@InputType()
export abstract class CreateQuestionTranslationsInput extends IntersectionType(
  PickType(QuestionTranslationEntity, ["text"]),
  PickType(LanguageEntity, ["locale"]),
  InputType
) {}

@InputType()
export class CreateQuestionInput extends PickType(QuestionEntity, ["partNumber"], InputType) {
  @Field(() => [CreateQuestionTranslationsInput])
  translations: CreateQuestionTranslationsInput[];
}
