import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { AnswerEntity } from "@app/api/visit-form/entities/answer.entity";

@InputType()
export class UpdateAnswerInput extends IntersectionType(
  PickType(AnswerEntity, ["questionId"] as const),
  PartialType(PickType(AnswerEntity, ["answer", "comment"] as const)),
  InputType
) {}
