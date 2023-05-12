import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { QuestionEntity } from "@app/api/question/entities/question.entity";
import { CreateTranslationInput } from "@app/api/utils/dto/create-translation.input";

@InputType()
export class CreateQuestionInput extends IntersectionType(
  CreateTranslationInput,
  PickType(QuestionEntity, ["partNumber", "order"] as const, InputType)
) {}
