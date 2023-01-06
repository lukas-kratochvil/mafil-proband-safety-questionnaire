import { InputType, PickType } from "@nestjs/graphql";
import { NativeLanguageTranslationEntity } from "@native-language-translation/entities/native-language-translation.entity";

@InputType()
export class CreateNativeLanguageTranslationInput extends PickType(
  NativeLanguageTranslationEntity,
  ["languageId", "nativeLanguageId", "text"],
  InputType
) {}
