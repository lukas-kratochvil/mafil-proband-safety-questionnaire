import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Operator, OperatorRole } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, MaxLength } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";

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
  @MaxLength(200)
  name: string;

  @Field()
  @MaxLength(200)
  surname: string;

  @Field()
  @MaxLength(8)
  uco: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => OperatorRole)
  @IsEnum(OperatorRole)
  role: OperatorRole;

  @Field()
  @IsBoolean()
  isValid: boolean;
}
