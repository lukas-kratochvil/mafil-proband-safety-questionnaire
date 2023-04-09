import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { IsDate, IsOptional, IsUUID } from "class-validator";
import { UUID } from "../scalars/uuid-scalar";

@ObjectType({ isAbstract: true })
export class BaseEntity {
  @IsUUID()
  @Field(() => UUID)
  id: string;

  @IsDate()
  @Field()
  createdAt: Date;

  @IsDate()
  @HideField()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  @HideField()
  deletedAt: Date | null;
}
