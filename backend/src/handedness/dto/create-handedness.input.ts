import { InputType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@app/graphql/dto/create-translation.input";

@InputType()
export class CreateHandednessInput extends CreateTranslationInput {}
