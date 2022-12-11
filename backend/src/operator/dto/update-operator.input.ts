import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateOperatorInput } from "./create-operator.input";

@InputType()
export class UpdateOperatorInput extends PartialType(CreateOperatorInput) {
  @Field(() => String)
  id: string;
}
