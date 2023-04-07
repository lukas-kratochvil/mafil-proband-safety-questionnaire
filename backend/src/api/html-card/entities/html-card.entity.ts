import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@ObjectType()
export class HTMLCardEntity {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  html: string;
}
