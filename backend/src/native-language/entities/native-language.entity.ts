import { Field, Int, ObjectType } from "@nestjs/graphql";
import { NativeLanguage } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";
import { TranslationEntity } from "@language/entities/translation-language.entity";

@ObjectType()
export class NativeLanguageEntity extends BaseEntity implements NativeLanguage {
  @Field(() => Int, { nullable: true })
  order: number | null;

  @Field(() => [TranslationEntity])
  translations: TranslationEntity[];
}
