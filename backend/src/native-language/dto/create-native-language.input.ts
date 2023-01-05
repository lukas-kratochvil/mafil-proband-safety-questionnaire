import { Field, InputType, PartialType, PickType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@language/dto/create-translation.input";
import { NativeLanguageEntity } from "@native-language/entities/native-language.entity";

@InputType()
export class CreateNativeLanguageInput extends PartialType(PickType(NativeLanguageEntity, ["order"], InputType)) {
  @Field(() => [CreateTranslationInput])
  translations: CreateTranslationInput[];
}
