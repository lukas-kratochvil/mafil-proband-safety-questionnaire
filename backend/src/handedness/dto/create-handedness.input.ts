import { InputType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@graphql/create-translation.input";

@InputType()
export class CreateHandednessInput extends CreateTranslationInput {}
