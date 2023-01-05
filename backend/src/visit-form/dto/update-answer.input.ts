import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { AnswerEntity } from "@visit-form/entities/answer.entity";

@InputType()
export class UpdateAnswerInput extends IntersectionType(
  PickType(AnswerEntity, ["id"]),
  PartialType(PickType(AnswerEntity, ["answer", "comment"])),
  InputType
) {}