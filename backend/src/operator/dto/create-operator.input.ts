import { Field, InputType } from "@nestjs/graphql";
import { OperatorRole } from "@prisma/client";

@InputType()
export class CreateOperatorInput {
  @Field()
  name: string;

  @Field()
  surname: string;

  @Field()
  uco: string;

  @Field()
  email: string;

  @Field(() => OperatorRole, { nullable: true })
  role: OperatorRole | null;
}
