import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";
import { Question } from "@prisma/client";
import { IsArray, IsBoolean, IsIn, IsOptional, IsUUID } from "class-validator";
import { TranslationBaseEntity } from "@app/api/utils/entities/translation-base.entity";
import { GenderHiddenQuestionEntity } from "./genderHiddenQuestion";

@ObjectType()
export class QuestionEntity extends TranslationBaseEntity implements Question {
  @HideField()
  @IsUUID()
  @IsOptional()
  previousQuestionId: string | null;

  @Field(() => Int)
  @IsIn([1, 2])
  partNumber: number;

  @Field()
  @IsBoolean()
  mustBeApproved: boolean;

  @Field()
  @IsBoolean()
  isValid: boolean;

  @Field(() => [GenderHiddenQuestionEntity])
  @IsArray()
  hiddenByGenders: GenderHiddenQuestionEntity[];
}
