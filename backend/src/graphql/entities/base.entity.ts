import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { UuidScalar } from "../scalars/uuid-scalar";

@ObjectType()
export class BaseEntity {
  @Field(() => UuidScalar)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @HideField()
  updatedAt: Date;

  @HideField()
  deletedAt: Date | null;
}
