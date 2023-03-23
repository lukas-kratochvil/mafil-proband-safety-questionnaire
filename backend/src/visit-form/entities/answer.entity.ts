import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { Answer } from "@prisma/client";
import { BaseEntity } from "@app/graphql/entities/base.entity";
import { UuidScalar } from "@app/graphql/scalars/uuid-scalar";

@ObjectType()
export class AnswerEntity extends BaseEntity implements Answer {
  @HideField()
  visitFormId: string;

  @Field(() => UuidScalar)
  questionId: string;

  @Field()
  answer: string;

  @Field()
  comment: string;
}
