import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@graphql/create-translation.input";
import { NativeLanguageEntity } from "@native-language/entities/native-language.entity";

@InputType()
export class CreateNativeLanguageInput extends IntersectionType(
  CreateTranslationInput,
  PartialType(PickType(NativeLanguageEntity, ["order"], InputType))
) {}
