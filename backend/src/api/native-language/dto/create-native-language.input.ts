import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { NativeLanguageEntity } from "@app/api/native-language/entities/native-language.entity";
import { CreateTranslationInput } from "@app/api/utils/dto/create-translation.input";

@InputType()
export class CreateNativeLanguageInput extends IntersectionType(
  CreateTranslationInput,
  IntersectionType(
    PickType(NativeLanguageEntity, ["code"] as const),
    PartialType(PickType(NativeLanguageEntity, ["order"] as const)),
    InputType
  )
) {}
