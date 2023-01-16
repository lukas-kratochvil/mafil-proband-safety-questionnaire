import { InputType, PickType } from "@nestjs/graphql";
import { HandednessTranslationEntity } from "@handedness-translation/entities/handedness-translation.entity";

@InputType()
export class CreateHandednessTranslationInput extends PickType(
  HandednessTranslationEntity,
  ["languageId", "handednessId", "text"],
  InputType
) {}
