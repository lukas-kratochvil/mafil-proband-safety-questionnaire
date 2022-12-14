import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { QuestionEntity } from "@question/entities/question.entity";
import { CreateQuestionInput } from "./create-question.input";

@InputType()
export class UpdateQuestionTextsInput extends IntersectionType(
  PickType(QuestionEntity, ["id"], InputType),
  IntersectionType(PartialType(CreateQuestionInput), PickType(CreateQuestionInput, ["translations"]))
) {}
