import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { NativeLanguageEntity } from "@app/api/native-language/entities/native-language.entity";
import { CreateNativeLanguageInput } from "./create-native-language.input";

@InputType()
export class UpdateNativeLanguageInput extends IntersectionType(
  PickType(NativeLanguageEntity, ["id"] as const, InputType),
  IntersectionType(
    PickType(CreateNativeLanguageInput, ["order"] as const),
    PartialType(PickType(CreateNativeLanguageInput, ["translations"] as const))
  )
) {}
