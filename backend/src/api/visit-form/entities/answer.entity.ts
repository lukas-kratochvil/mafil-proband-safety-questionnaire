import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { Answer } from "@prisma/client";
import { BaseEntity } from "@app/api/graphql/entities/base.entity";
import { UUID } from "@app/api/graphql/scalars/uuid-scalar";

@ObjectType()
export class AnswerEntity extends BaseEntity implements Answer {
  @HideField()
  visitFormId: string;

  @Field(() => UUID)
  questionId: string;

  @Field()
  answer: string;

  @Field()
  comment: string;
}
