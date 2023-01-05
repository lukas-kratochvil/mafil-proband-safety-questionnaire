import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { AnswerEntity } from "@visit-form/entities/answer.entity";

@InputType()
export class UpdateAnswerInput extends IntersectionType(
  PickType(AnswerEntity, ["id", "answer"]),
  PartialType(PickType(AnswerEntity, ["comment"])),
  InputType
) {}
