import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";
import { Question } from "@prisma/client";
import { TranslationBaseEntity } from "@app/api/graphql/entities/translation-base.entity";

@ObjectType()
export class QuestionEntity extends TranslationBaseEntity implements Question {
  @HideField()
  previousQuestionId: string | null;

  @Field(() => Int)
  partNumber: number;

  @Field()
  mustBeApproved: boolean;

  @Field()
  isValid: boolean;
}
