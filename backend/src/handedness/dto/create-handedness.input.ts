import { InputType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@graphql/dto/create-translation.input";

@InputType()
export class CreateHandednessInput extends CreateTranslationInput {}
