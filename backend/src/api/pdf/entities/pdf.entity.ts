import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsString } from "class-validator";

export enum PDFType {
  PROBAND,
  OPERATOR,
  PHANTOM,
}

registerEnumType(PDFType, {
  name: "PDFType",
  description: "Types of PDFs that can be generated.",
  valuesMap: {
    PROBAND: {
      description: "PDF for the proband.",
    },
    OPERATOR: {
      description: "PDF for the operator.",
    },
    PHANTOM: {
      description: "Phantom PDF.",
    },
  },
});

@ObjectType()
export class PDFEntity {
  @IsEnum(PDFType)
  @Field(() => PDFType)
  type: PDFType;

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
