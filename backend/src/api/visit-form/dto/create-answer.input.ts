import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { AnswerEntity } from "@app/api/visit-form/entities/answer.entity";

@InputType()
export class CreateAnswerInput extends IntersectionType(
  PickType(AnswerEntity, ["questionId", "answer"] as const),
  // comment field is used when duplicating existing visit form that is going for approval
  PartialType(PickType(AnswerEntity, ["comment"] as const)),
  InputType
) {}
