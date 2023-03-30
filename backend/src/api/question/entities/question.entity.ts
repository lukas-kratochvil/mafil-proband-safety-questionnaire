import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";
import { GenderHiddenQuestion, Question } from "@prisma/client";
import { TranslationBaseEntity } from "@app/api/utils/entities/translation-base.entity";
import { GenderHiddenQuestionEntity } from "./genderHiddenQuestion";

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

  @Field(() => [GenderHiddenQuestionEntity])
  hiddenByGenders: GenderHiddenQuestion[];
}
