import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@ObjectType()
export class HTMLCardEntity {
  @IsString()
  @Field()
  title: string;

  @IsString()
  @Field()
  html: string;
}
