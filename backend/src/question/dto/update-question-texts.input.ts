import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { QuestionEntity } from "@app/question/entities/question.entity";
import { CreateQuestionInput } from "./create-question.input";

@InputType()
export class UpdateQuestionTextsInput extends IntersectionType(
  PickType(QuestionEntity, ["id"]),
  IntersectionType(
    PartialType(PickType(CreateQuestionInput, ["partNumber"])),
    PickType(CreateQuestionInput, ["translations"])
  ),
  InputType
) {}
