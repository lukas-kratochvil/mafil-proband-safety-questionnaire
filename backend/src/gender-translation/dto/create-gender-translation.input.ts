import { InputType, PickType } from "@nestjs/graphql";
import { GenderTranslationEntity } from "@gender-translation/entities/gender-translation.entity";

@InputType()
export class CreateGenderTranslationInput extends PickType(
  GenderTranslationEntity,
  ["languageId", "genderId", "text"],
  InputType
) {}
