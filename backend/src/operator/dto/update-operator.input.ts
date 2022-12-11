import { Field, InputType, PartialType } from "@nestjs/graphql";
import { UuidScalar } from "@graphql/uuid-scalar";
import { CreateOperatorInput } from "./create-operator.input";

@InputType()
export class UpdateOperatorInput extends PartialType(CreateOperatorInput) {
  @Field(() => UuidScalar)
  id: string;
}
