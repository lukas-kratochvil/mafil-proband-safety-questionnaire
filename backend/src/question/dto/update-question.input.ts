import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { QuestionEntity } from "@app/question/entities/question.entity";

@InputType()
export class UpdateQuestionInput extends IntersectionType(
  PickType(QuestionEntity, ["id"], InputType),
  PartialType(PickType(QuestionEntity, ["isValid", "partNumber"], InputType))
) {}
