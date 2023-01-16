import { Field, InputType, PickType } from "@nestjs/graphql";
import { GenderEntity } from "@gender/entities/gender.entity";
import { CreateTranslationInput } from "@language/dto/create-translation.input";

@InputType()
export class CreateGenderInput extends PickType(GenderEntity, ["code"], InputType) {
  @Field(() => [CreateTranslationInput])
  translations: CreateTranslationInput[];
}
