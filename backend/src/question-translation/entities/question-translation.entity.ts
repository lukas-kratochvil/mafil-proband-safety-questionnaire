import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { QuestionTranslation } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";

@ObjectType()
export class QuestionTranslationEntity extends BaseEntity implements QuestionTranslation {
  @HideField()
  questionId: string;

  @HideField()
  languageId: string;

  @Field()
  text: string;
}
