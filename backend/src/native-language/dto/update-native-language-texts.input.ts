import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { CreateNativeLanguageInput } from "./create-native-language.input";
import { UpdateNativeLanguageInput } from "./update-native-language.input";

@InputType()
export class UpdateNativeLanguageTextsInput extends IntersectionType(
  UpdateNativeLanguageInput,
  PickType(CreateNativeLanguageInput, ["translations"])
) {}
