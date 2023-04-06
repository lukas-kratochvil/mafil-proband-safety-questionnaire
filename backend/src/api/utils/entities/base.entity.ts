import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { UUID } from "../scalars/uuid-scalar";

@ObjectType()
export class BaseEntity {
  @Field(() => UUID)
  id: string;

  @Field()
  createdAt: Date;

  @HideField()
  updatedAt: Date;

  @HideField()
  deletedAt: Date | null;
}
