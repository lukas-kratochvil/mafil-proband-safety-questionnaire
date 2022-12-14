import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { LanguageEntity } from "@language/entities/language.entity";

@ObjectType({ isAbstract: true })
abstract class AbstractTranslationLanguageEntity extends PickType(LanguageEntity, ["locale", "name"]) {}

@ObjectType({ isAbstract: true })
export abstract class AbstractTranslationEntity {
  @Field()
  text: string;

  @Field(() => AbstractTranslationLanguageEntity)
  language: AbstractTranslationLanguageEntity;
}
