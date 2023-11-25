import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@ObjectType()
export class PDFEntity {
  @IsString()
  @Field()
  name: string; // also contains extension, for example: my_doc.pdf

  @IsString()
  @Field()
  content: string; // Base64 encoded PDF content
}
