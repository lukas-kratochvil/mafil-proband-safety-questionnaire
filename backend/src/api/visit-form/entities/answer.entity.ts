import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { Answer } from "@prisma/client";
import { IsString, IsUUID, MaxLength } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";

@ObjectType()
export class AnswerEntity extends BaseEntity implements Answer {
  @IsUUID()
  @HideField()
  visitFormId: string;

  @IsUUID()
  @Field(() => UUID)
  questionId: string;

  @MaxLength(3)
  @Field()
  answer: string;

  @IsString()
  @Field()
  comment: string;
}
