import { InputType, PickType } from "@nestjs/graphql";
import { HandednessTranslationEntity } from "@handedness-translation/entities/handedness-translation.entity";

@InputType()
export class UpdateHandednessTranslationInput extends PickType(
  HandednessTranslationEntity,
  ["id", "text"],
  InputType
) {}
