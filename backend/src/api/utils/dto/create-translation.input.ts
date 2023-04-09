import { Field, InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { ArrayNotEmpty, ArrayUnique, IsArray } from "class-validator";
import { LanguageEntity } from "@app/api/language/entities/language.entity";
import { BaseEntity } from "../entities/base.entity";
import { TranslationEntity } from "../entities/translation-base.entity";

@InputType({ isAbstract: true })
export class TranslationInput extends IntersectionType(
  PickType(LanguageEntity, ["code"]),
  PickType(TranslationEntity, ["text"]),
  InputType
) {}

@InputType()
export class CreateTranslationInput extends BaseEntity {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique<TranslationInput>((elem) => elem.code)
  @Field(() => [TranslationInput])
  translations: TranslationInput[];
}
