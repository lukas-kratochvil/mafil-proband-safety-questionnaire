import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@ObjectType()
export class PDFEntity {
  @IsString()
  @Field()
  name: string;

  @IsString()
  @Field()
  extension: string;

  @IsString()
  @Field()
  content: string;
}
