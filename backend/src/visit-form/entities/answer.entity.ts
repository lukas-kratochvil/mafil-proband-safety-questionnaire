import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { Answer } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";
import { UuidScalar } from "@graphql/uuid-scalar";

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
