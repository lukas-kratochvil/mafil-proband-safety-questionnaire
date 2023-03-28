import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Operator, OperatorRole } from "@prisma/client";
import { BaseEntity } from "@app/api/graphql/entities/base.entity";

registerEnumType(OperatorRole, {
  name: "OperatorRole",
  description: "Indicates operator permissions.",
  valuesMap: {
    MR: {
      description: "Default operator role.",
    },
    MR_HIGH_PERM: {
      description: "Operator having higher permissions.",
    },
  },
});

@ObjectType()
export class OperatorEntity extends BaseEntity implements Operator {
  @Field()
  name: string;

  @Field()
  surname: string;

  @Field()
  uco: string;

  @Field()
  email: string;

  @Field(() => OperatorRole)
  role: OperatorRole;

  @Field()
  isValid: boolean;
}
