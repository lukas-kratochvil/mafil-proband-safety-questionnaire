import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { BaseEntity } from "@app/graphql/entities/base.entity";
import { LanguageEntity } from "@app/language/entities/language.entity";

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
