import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@app/api/graphql/dto/create-translation.input";
import { GenderEntity } from "../entities/gender.entity";

@InputType()
export class CreateGenderInput extends IntersectionType(
  CreateTranslationInput,
  PickType(GenderEntity, ["code"], InputType)
) {}
