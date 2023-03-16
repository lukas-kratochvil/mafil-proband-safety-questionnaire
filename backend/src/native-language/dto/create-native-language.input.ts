import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@app/graphql/dto/create-translation.input";
import { NativeLanguageEntity } from "@app/native-language/entities/native-language.entity";

@InputType()
export class CreateNativeLanguageInput extends IntersectionType(
  CreateTranslationInput,
  IntersectionType(
    PickType(NativeLanguageEntity, ["code"]),
    PartialType(PickType(NativeLanguageEntity, ["order"])),
    InputType
  )
) {}
