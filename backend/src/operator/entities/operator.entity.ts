import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { OperatorRole } from "@prisma/client";

@ObjectType()
export class Operator {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;

  @Field(() => String)
  name: string;

  @Field(() => String)
  surname: string;

  @Field(() => String)
  uco: string;

  @Field(() => String)
  email: string;

  @Field(() => OperatorRole, { defaultValue: OperatorRole.MR })
  role: OperatorRole;

  @Field(() => Boolean, { defaultValue: true })
  isValid: boolean;
}

registerEnumType(OperatorRole, {
  name: "OperatorRole",
  description: "Indicates operator permissions",
  valuesMap: {
    MR: {
      description: "Default operator role.",
    },
    MR_HIGH_PERM: {
      description: "Operator having higher permissions.",
    },
  },
});
