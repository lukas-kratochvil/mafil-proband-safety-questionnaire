import { Field, InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { BaseEntity } from "@graphql/entities/base.entity";
import { LanguageEntity } from "@language/entities/language.entity";
import { TranslationEntity } from "@graphql/entities/translation-base.entity";

@InputType({ isAbstract: true })
export class TranslationInput extends IntersectionType(
  PickType(LanguageEntity, ["code"]),
  PickType(TranslationEntity, ["text"]),
  InputType
) {}

@InputType()
export class CreateTranslationInput extends BaseEntity {
  @Field(() => [TranslationInput])
  translations: TranslationInput[];
}
