import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { QuestionEntity } from "@app/api/question/entities/question.entity";

@InputType()
export class UpdateQuestionInput extends IntersectionType(
  PickType(QuestionEntity, ["id"] as const, InputType),
  PartialType(PickType(QuestionEntity, ["isValid", "partNumber", "order"] as const, InputType))
) {}
