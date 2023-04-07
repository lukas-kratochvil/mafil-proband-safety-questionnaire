import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { IsDate, IsOptional, IsUUID } from "class-validator";
import { UUID } from "../scalars/uuid-scalar";

@ObjectType()
export class BaseEntity {
  @Field(() => UUID)
  @IsUUID()
  id: string;

  @Field()
  @IsDate()
  createdAt: Date;

  @HideField()
  @IsDate()
  updatedAt: Date;

  @HideField()
  @IsDate()
  @IsOptional()
  deletedAt: Date | null;
}
