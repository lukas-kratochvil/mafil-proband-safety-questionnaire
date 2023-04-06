import { InputType, PickType } from "@nestjs/graphql";
import { NativeLanguageTranslationEntity } from "@app/api/native-language-translation/entities/native-language-translation.entity";

@InputType()
export class UpdateNativeLanguageTranslationInput extends PickType(
  NativeLanguageTranslationEntity,
  ["id", "text"] as const,
  InputType
) {}
