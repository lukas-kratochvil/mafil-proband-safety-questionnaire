import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { Answer } from "@prisma/client";
import { BaseEntity } from "@graphql/entities/base.entity";
import { UuidScalar } from "@graphql/scalars/uuid-scalar";

@ObjectType()
export class AnswerEntity extends BaseEntity implements Answer {
  @HideField()
  visitFormId: string;

  @Field(() => UuidScalar)
  questionId: string;

  @Field()
  answer: string;

  @Field(() => String, { nullable: true })
  comment: string | null;
}
