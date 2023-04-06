import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { OperatorEntity } from "@app/api/operator/entities/operator.entity";

@InputType()
export class CreateOperatorInput extends IntersectionType(
  PickType(OperatorEntity, ["name", "surname", "uco", "email"] as const, InputType),
  PartialType(PickType(OperatorEntity, ["role"] as const, InputType))
) {}
