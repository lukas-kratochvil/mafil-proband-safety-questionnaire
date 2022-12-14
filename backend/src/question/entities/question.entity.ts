import { Field, HideField, Int, ObjectType, PickType } from "@nestjs/graphql";
import { Question } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";
import { LanguageEntity } from "@language/entities/language.entity";
import { QuestionTranslationEntity } from "@question-translation/entities/question-translation.entity";

@ObjectType({ isAbstract: true })
export abstract class TranslationLanguageEntity extends PickType(LanguageEntity, ["locale", "name"]) {}

@ObjectType({ isAbstract: true })
export abstract class TranslationEntity extends PickType(QuestionTranslationEntity, ["text"]) {
  @Field(() => TranslationLanguageEntity)
  language: TranslationLanguageEntity;
}

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
