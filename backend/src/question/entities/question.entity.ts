import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";
import { Question } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";
import { TranslationEntity } from "@language/entities/translation-language.entity";

@ObjectType()
export class QuestionEntity extends BaseEntity implements Question {
  @HideField()
  previousQuestionId: string | null;

  @Field(() => [TranslationEntity])
  translations: TranslationEntity[];

  @Field(() => Int)
  partNumber: number;

  @Field()
  mustBeApproved: boolean;

  @Field()
  isValid: boolean;
}
