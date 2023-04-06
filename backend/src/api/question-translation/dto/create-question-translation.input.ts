import { InputType, PickType } from "@nestjs/graphql";
import { QuestionTranslationEntity } from "@app/api/question-translation/entities/question-translation.entity";

@InputType()
export class CreateQuestionTranslationInput extends PickType(
  QuestionTranslationEntity,
  ["languageId", "questionId", "text"] as const,
  InputType
) {}
