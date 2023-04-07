import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class HTMLCardEntity {
  @Field()
  title: string;

  @Field()
  html: string;
}
