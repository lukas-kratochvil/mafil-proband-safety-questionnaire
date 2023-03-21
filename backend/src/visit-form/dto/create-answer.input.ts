import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { AnswerEntity } from "@app/visit-form/entities/answer.entity";

@InputType()
export class CreateAnswerInput extends IntersectionType(
  PickType(AnswerEntity, ["questionId", "answer"]),
  // comment field is used when duplicating existing visit form
  PartialType(PickType(AnswerEntity, ["comment"])),
  InputType
) {}
