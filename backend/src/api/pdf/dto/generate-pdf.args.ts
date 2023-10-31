import { ArgsType, Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from "class-validator";
import { AdditionalVisitFormInfoEntity } from "@app/api/visit-form/entities/additional-visit-form-info.entity";
import { AnswerEntity } from "@app/api/visit-form/entities/answer.entity";
import { VisitFormEntity } from "@app/api/visit-form/entities/visit-form.entity";

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
  PickType(AdditionalVisitFormInfoEntity, ["projectAcronym", "measuredAt"] as const),
  ArgsType
) {
  @IsString()
  @Field()
  visitId: string;

  @IsBoolean()
  @Field()
  isPhantom: boolean;

  @IsString()
  @Field()
  genderCode: string;

  @IsString()
  @Field()
  nativeLanguageCode: string;

  @IsString()
  @Field()
  handednessCode: string;

  // In the MAFILDB is stored operator's username
  @IsString()
  @Field()
  finalizerUsername: string;

  // In the MAFILDB is stored operator's username
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  approverUsername?: string;

  // eslint-disable-next-line @darraghor/nestjs-typed/all-properties-have-explicit-defined
  @ValidateIf((object: GeneratePDFArgs) => !object.isPhantom)
  @MaxLength(5)
  @Field({ nullable: true })
  probandLanguageCode?: string;

  // eslint-disable-next-line @darraghor/nestjs-typed/all-properties-have-explicit-defined
  @ValidateIf((object: GeneratePDFArgs) => !object.isPhantom)
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique<PDFAnswer>((elem) => elem.questionId)
  @Field(() => [PDFAnswer], { nullable: true })
  answers?: PDFAnswer[];
}
