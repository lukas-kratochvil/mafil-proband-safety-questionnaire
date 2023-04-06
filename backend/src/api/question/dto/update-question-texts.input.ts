import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { QuestionEntity } from "@app/api/question/entities/question.entity";
import { CreateQuestionInput } from "./create-question.input";

@InputType()
export class UpdateQuestionTextsInput extends IntersectionType(
  PickType(QuestionEntity, ["id"] as const),
  IntersectionType(
    PartialType(PickType(CreateQuestionInput, ["partNumber"] as const)),
    PickType(CreateQuestionInput, ["translations"] as const)
  ),
  InputType
) {}
