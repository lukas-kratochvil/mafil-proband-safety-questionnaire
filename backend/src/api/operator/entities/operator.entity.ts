import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Operator, OperatorRole } from "@prisma/client";
import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, MaxLength } from "class-validator";
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
  @MaxLength(200)
  @Field()
  name: string;

  @MaxLength(200)
  @Field()
  surname: string;

  @MaxLength(255)
  @Field()
  username: string;

  @IsEmail()
  @MaxLength(320)
  @Field()
  email: string;

  @IsEnum(OperatorRole)
  @Field(() => OperatorRole)
  role: OperatorRole;

  @IsBoolean()
  @Field()
  isValid: boolean;

  @IsOptional()
  @IsDate()
  @Field(() => Date)
  lastLoggedAt: Date | null;
}
