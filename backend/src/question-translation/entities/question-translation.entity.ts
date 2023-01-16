import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { QuestionTranslation } from "@prisma/client";
import { BaseEntity } from "@graphql/entities/base.entity";

@ObjectType()
export class QuestionTranslationEntity extends BaseEntity implements QuestionTranslation {
  @HideField()
  questionId: string;

  @HideField()
  languageId: string;

  @Field()
  text: string;
}
