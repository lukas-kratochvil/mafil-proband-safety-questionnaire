import { InputType, PickType } from "@nestjs/graphql";
import { LanguageEntity } from "@app/api/language/entities/language.entity";

@InputType()
export class CreateLanguageInput extends PickType(LanguageEntity, ["code", "name"] as const, InputType) {}
