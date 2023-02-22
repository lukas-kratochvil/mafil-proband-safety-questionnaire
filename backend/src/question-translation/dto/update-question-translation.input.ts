import { InputType, PickType } from "@nestjs/graphql";
import { QuestionTranslationEntity } from "@app/question-translation/entities/question-translation.entity";

@InputType()
export class UpdateQuestionTranslationInput extends PickType(QuestionTranslationEntity, ["id", "text"], InputType) {}
