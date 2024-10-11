import { Field, HideField, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Answer, AnswerOption } from "@prisma/client";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";

registerEnumType(AnswerOption, {
  name: "AnswerOption",
  description: "Question answer options.",
});

@ObjectType()
export class AnswerEntity extends BaseEntity implements Answer {
  @IsUUID()
  @HideField()
  visitFormId: string;

  @IsUUID()
  @Field(() => UUID)
  questionId: string;

  @IsEnum(AnswerOption)
  @Field(() => AnswerOption)
  answer: AnswerOption;

  @IsString()
  @Field()
  comment: string;
}
