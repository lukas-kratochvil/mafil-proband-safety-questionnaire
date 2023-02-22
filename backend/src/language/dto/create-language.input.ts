import { InputType, PickType } from "@nestjs/graphql";
import { LanguageEntity } from "@app/language/entities/language.entity";

@InputType()
export class CreateLanguageInput extends PickType(LanguageEntity, ["code", "name"], InputType) {}
