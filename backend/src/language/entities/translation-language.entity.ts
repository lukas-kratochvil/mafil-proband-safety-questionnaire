import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { LanguageEntity } from "@language/entities/language.entity";

@ObjectType({ isAbstract: true })
class TranslationLanguageEntity extends PickType(LanguageEntity, ["code", "name"]) {}

@ObjectType({ isAbstract: true })
export class TranslationEntity {
  @Field()
  text: string;

  @Field(() => TranslationLanguageEntity)
  language: TranslationLanguageEntity;
}
