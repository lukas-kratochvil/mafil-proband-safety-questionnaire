import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { GenderEntity } from "@app/gender/entities/gender.entity";
import { CreateTranslationInput } from "@app/graphql/dto/create-translation.input";

@InputType()
export class CreateGenderInput extends IntersectionType(
  CreateTranslationInput,
  PickType(GenderEntity, ["code"], InputType)
) {}
