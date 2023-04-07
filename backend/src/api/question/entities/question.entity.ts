import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";
import { GenderHiddenQuestion, Question } from "@prisma/client";
import { IsArray, IsBoolean, IsIn, IsOptional, IsUUID } from "class-validator";
import { TranslationBaseEntity } from "@app/api/utils/entities/translation-base.entity";
import { GenderHiddenQuestionEntity } from "./genderHiddenQuestion";

@ObjectType()
export class QuestionEntity extends TranslationBaseEntity implements Question {
  @IsOptional()
  @IsUUID()
  @HideField()
  previousQuestionId: string | null;

  @IsIn([1, 2])
  @Field(() => Int)
  partNumber: number;

  @IsBoolean()
  @Field()
  mustBeApproved: boolean;

  @IsBoolean()
  @Field()
  isValid: boolean;

  @IsArray()
  @Field(() => [GenderHiddenQuestionEntity])
  hiddenByGenders: GenderHiddenQuestion[];
}
