import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { LanguageEntity } from "@language/entities/language.entity";
import { CreateLanguageInput } from "./create-language.input";

@InputType()
export class UpdateLanguageInput extends IntersectionType(
  PickType(LanguageEntity, ["id"]),
  PartialType(CreateLanguageInput),
  InputType
) {}
