import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { AnswerEntity } from "@app/visit-form/entities/answer.entity";

@InputType()
export class UpdateAnswerInput extends IntersectionType(
  PickType(AnswerEntity, ["questionId"]),
  PartialType(PickType(AnswerEntity, ["answer", "comment"])),
  InputType
) {}
