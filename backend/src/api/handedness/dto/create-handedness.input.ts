import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { CreateTranslationInput } from "@app/api/utils/dto/create-translation.input";
import { HandednessEntity } from "../entities/handedness.entity";

@InputType()
export class CreateHandednessInput extends IntersectionType(
  CreateTranslationInput,
  PickType(HandednessEntity, ["code", "order"] as const, InputType)
) {}
