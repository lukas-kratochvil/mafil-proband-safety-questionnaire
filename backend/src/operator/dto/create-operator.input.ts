import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { OperatorEntity } from "@app/operator/entities/operator.entity";

@InputType()
export class CreateOperatorInput extends IntersectionType(
  PickType(OperatorEntity, ["name", "surname", "uco", "email"], InputType),
  PartialType(PickType(OperatorEntity, ["role"], InputType))
) {}
