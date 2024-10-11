import { ArgsType, Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from "class-validator";
import { AdditionalVisitFormInfoEntity } from "@app/api/visit-form/entities/additional-visit-form-info.entity";
import { AnswerEntity } from "@app/api/visit-form/entities/answer.entity";
import { VisitFormEntity } from "@app/api/visit-form/entities/visit-form.entity";

@InputType()
class PDFNativeLanguage {
  @IsString()
  @Field()
  nativeName: string;

  @IsString()
  @Field()
  nameCs: string;
}

@InputType()
class PDFAnswer extends IntersectionType(
  PickType(AnswerEntity, ["questionId", "answer"] as const),
  PartialType(PickType(AnswerEntity, ["comment"] as const)),
  InputType
) {}

@ArgsType()
export class GeneratePDFArgs extends IntersectionType(
  PickType(VisitFormEntity, [
    "name",
    "surname",
    "personalId",
    "birthdate",
    "heightCm",
    "weightKg",
    "visualCorrectionDioptre",
    "email",
    "phone",
  ] as const),
  PickType(AdditionalVisitFormInfoEntity, ["measuredAt"] as const),
  ArgsType
) {
  @IsString()
  @Field()
  visitId: string;

  @IsBoolean()
  @Field()
  isPhantom: boolean;

  // MAFILDB project acronym
  @IsString()
  @Field()
  projectAcronym: string;

  @IsString()
  @Field()
  genderCode: string;

  @IsObject()
  @Field(() => PDFNativeLanguage)
  nativeLanguage: PDFNativeLanguage;

  @IsString()
  @Field()
  handednessCode: string;

  // Operator's username is stored in MAFILDB
  @IsString()
  @Field()
  finalizerUsername: string;

  // Operator's username is stored in MAFILDB
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  approverUsername?: string;

  @ValidateIf((object: GeneratePDFArgs) => !object.isPhantom)
  @MaxLength(5)
  @Field({ nullable: true })
  probandLanguageCode?: string;

  @ValidateIf((object: GeneratePDFArgs) => !object.isPhantom)
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique<PDFAnswer>((elem) => elem.questionId)
  @Field(() => [PDFAnswer], { nullable: true })
  answers?: PDFAnswer[];
}
