import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@graphql/create-translation.input";
import { QuestionEntity } from "@question/entities/question.entity";

@InputType()
export class CreateQuestionInput extends IntersectionType(
  CreateTranslationInput,
  PickType(QuestionEntity, ["partNumber"], InputType)
) {}
