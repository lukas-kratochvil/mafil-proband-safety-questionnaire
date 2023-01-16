import { BaseEntity } from "@graphql/base.entity";
import { LanguageEntity } from "@language/entities/language.entity";
import { Field, ObjectType, PickType } from "@nestjs/graphql";

@ObjectType({ isAbstract: true })
export class TranslationLanguageEntity extends PickType(LanguageEntity, ["code", "name"]) {}

@ObjectType({ isAbstract: true })
export class TranslationEntity {
  @Field()
  text: string;

  @Field(() => TranslationLanguageEntity)
  language: TranslationLanguageEntity;
}

@ObjectType({ isAbstract: true })
export class TranslationBaseEntity extends BaseEntity {
  @Field(() => [TranslationEntity])
  translations: TranslationEntity[];
}
