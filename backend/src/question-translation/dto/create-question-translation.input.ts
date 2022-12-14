import { InputType, PickType } from "@nestjs/graphql";
import { QuestionTranslationEntity } from "@question-translation/entities/question-translation.entity";

@InputType()
export class CreateQuestionTranslationInput extends PickType(
  QuestionTranslationEntity,
  ["languageId", "questionId", "text"],
  InputType
) {}
