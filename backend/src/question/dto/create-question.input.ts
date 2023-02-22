import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@app/graphql/dto/create-translation.input";
import { QuestionEntity } from "@app/question/entities/question.entity";

@InputType()
export class CreateQuestionInput extends IntersectionType(
  CreateTranslationInput,
  PickType(QuestionEntity, ["partNumber"], InputType)
) {}
