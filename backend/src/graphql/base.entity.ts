import { Field, ObjectType } from "@nestjs/graphql";
import { UuidScalar } from "./uuid-scalar";

@ObjectType()
export class BaseEntity {
  @Field(() => UuidScalar)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;
}
