import { InputType, PickType } from "@nestjs/graphql";
import { QuestionTranslationEntity } from "@app/api/question-translation/entities/question-translation.entity";

@InputType()
export class UpdateQuestionTranslationInput extends PickType(
  QuestionTranslationEntity,
  ["id", "text"] as const,
  InputType
) {}
