import { InputType, PickType } from "@nestjs/graphql";
import { HandednessTranslationEntity } from "@app/api/handedness-translation/entities/handedness-translation.entity";

@InputType()
export class UpdateHandednessTranslationInput extends PickType(
  HandednessTranslationEntity,
  ["id", "text"] as const,
  InputType
) {}
