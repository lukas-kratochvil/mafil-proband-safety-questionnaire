import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { OperatorEntity } from "@app/api/operator/entities/operator.entity";
import { CreateOperatorInput } from "./create-operator.input";

@InputType()
export class UpdateOperatorInput extends IntersectionType(
  PickType(OperatorEntity, ["id"], InputType),
  PartialType(CreateOperatorInput)
) {}
