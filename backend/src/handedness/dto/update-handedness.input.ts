import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { HandednessEntity } from "@app/handedness/entities/handedness.entity";
import { CreateHandednessInput } from "./create-handedness.input";

@InputType()
export class UpdateHandednessInput extends IntersectionType(
  PickType(HandednessEntity, ["id"], InputType),
  PartialType(CreateHandednessInput)
) {}
