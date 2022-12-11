import { Field, InputType } from "@nestjs/graphql";
import { OperatorRole } from "@prisma/client";

@InputType()
export class CreateOperatorInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  surname: string;

  @Field(() => String)
  uco: string;

  @Field(() => String)
  email: string;

  @Field(() => OperatorRole, { nullable: true })
  role: OperatorRole | null;
}
