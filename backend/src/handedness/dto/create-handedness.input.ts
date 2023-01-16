import { Field, InputType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@language/dto/create-translation.input";

@InputType()
export class CreateHandednessInput {
  @Field(() => [CreateTranslationInput])
  translations: CreateTranslationInput[];
}
