import { InputType, PickType } from "@nestjs/graphql";
import { GenderTranslationEntity } from "@app/api/gender-translation/entities/gender-translation.entity";

@InputType()
export class UpdateGenderTranslationInput extends PickType(
  GenderTranslationEntity,
  ["id", "text"] as const,
  InputType
) {}
