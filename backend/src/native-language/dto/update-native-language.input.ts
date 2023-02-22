import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { NativeLanguageEntity } from "@app/native-language/entities/native-language.entity";
import { CreateNativeLanguageInput } from "./create-native-language.input";

@InputType()
export class UpdateNativeLanguageInput extends IntersectionType(
  PickType(NativeLanguageEntity, ["id"], InputType),
  IntersectionType(
    PickType(CreateNativeLanguageInput, ["order"]),
    PartialType(PickType(CreateNativeLanguageInput, ["translations"]))
  )
) {}
