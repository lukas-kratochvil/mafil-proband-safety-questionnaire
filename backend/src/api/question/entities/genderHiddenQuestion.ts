import { Field, ObjectType } from "@nestjs/graphql";
import { GenderHiddenQuestion } from "@prisma/client";
import { IsUUID, MaxLength } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";

@ObjectType()
export class GenderHiddenQuestionEntity extends BaseEntity implements GenderHiddenQuestion {
  @Field()
  @MaxLength(1)
  genderCode: string;

  @Field(() => UUID)
  @IsUUID()
  questionId: string;
}
