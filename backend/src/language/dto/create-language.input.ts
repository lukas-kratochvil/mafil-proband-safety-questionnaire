import { InputType, PickType } from "@nestjs/graphql";
import { LanguageEntity } from "@language/entities/language.entity";

@InputType()
export class CreateLanguageInput extends PickType(LanguageEntity, ["name", "locale"], InputType) {}
