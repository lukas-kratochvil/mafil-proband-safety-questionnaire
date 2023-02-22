import { Field, InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { BaseEntity } from "@app/graphql/entities/base.entity";
import { TranslationEntity } from "@app/graphql/entities/translation-base.entity";
import { LanguageEntity } from "@app/language/entities/language.entity";

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
