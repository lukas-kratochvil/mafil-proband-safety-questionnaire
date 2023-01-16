import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { GenderEntity } from "@gender/entities/gender.entity";
import { CreateTranslationInput } from "@graphql/create-translation.input";

@InputType()
export class CreateGenderInput extends IntersectionType(
  CreateTranslationInput,
  PickType(GenderEntity, ["code"], InputType)
) {}
