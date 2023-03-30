import { Field, ObjectType } from "@nestjs/graphql";
import { GenderHiddenQuestion } from "@prisma/client";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";

@ObjectType()
export class GenderHiddenQuestionEntity extends BaseEntity implements GenderHiddenQuestion {
  @Field()
  genderCode: string;

  @Field(() => UUID)
  questionId: string;
}
