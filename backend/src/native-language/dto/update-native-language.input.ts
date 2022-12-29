import { InputType, PickType } from "@nestjs/graphql";
import { NativeLanguageEntity } from "@native-language/entities/native-language.entity";

@InputType()
export class UpdateNativeLanguageInput extends PickType(NativeLanguageEntity, ["id", "order"], InputType) {}
