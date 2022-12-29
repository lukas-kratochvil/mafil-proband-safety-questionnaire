import { Field, InputType, PickType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@language/dto/create-translation.input";
import { NativeLanguageEntity } from "@native-language/entities/native-language.entity";

@InputType()
export class CreateNativeLanguageInput extends PickType(NativeLanguageEntity, ["order"], InputType) {
  @Field(() => [CreateTranslationInput])
  translations: CreateTranslationInput[];
}
