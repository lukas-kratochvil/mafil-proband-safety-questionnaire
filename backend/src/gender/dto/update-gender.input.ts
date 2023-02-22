import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { GenderEntity } from "@app/gender/entities/gender.entity";
import { CreateGenderInput } from "./create-gender.input";

@InputType()
export class UpdateGenderInput extends IntersectionType(
  PickType(GenderEntity, ["id"] as const, InputType),
  PartialType(CreateGenderInput)
) {}
