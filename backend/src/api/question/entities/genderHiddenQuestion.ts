import { Field, ObjectType } from "@nestjs/graphql";
import { GenderHiddenQuestion } from "@prisma/client";
import { IsUUID, MaxLength } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";

@ObjectType()
export class GenderHiddenQuestionEntity extends BaseEntity implements GenderHiddenQuestion {
  @MaxLength(1)
  @Field()
  genderCode: string;

  @IsUUID()
  @Field(() => UUID)
  questionId: string;
}
