import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@app/api/graphql/dto/create-translation.input";
import { QuestionEntity } from "@app/api/question/entities/question.entity";

@InputType()
export class CreateQuestionInput extends IntersectionType(
  CreateTranslationInput,
  PickType(QuestionEntity, ["partNumber"], InputType)
) {}
