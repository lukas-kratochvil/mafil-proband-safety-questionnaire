import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { QuestionTranslation } from "@prisma/client";
import { IsString, IsUUID } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";

@ObjectType()
export class QuestionTranslationEntity extends BaseEntity implements QuestionTranslation {
  @HideField()
  @IsUUID()
  questionId: string;

  @HideField()
  @IsUUID()
  languageId: string;

  @Field()
  @IsString()
  text: string;
}
