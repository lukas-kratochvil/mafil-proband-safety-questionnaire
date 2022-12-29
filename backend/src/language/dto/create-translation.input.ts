import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { LanguageEntity } from "@language/entities/language.entity";
import { TranslationEntity } from "@language/entities/translation-language.entity";

@InputType({ isAbstract: true })
export class CreateTranslationInput extends IntersectionType(
  PickType(LanguageEntity, ["locale"]),
  PickType(TranslationEntity, ["text"]),
  InputType
) {}
