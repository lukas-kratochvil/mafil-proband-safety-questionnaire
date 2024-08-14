import { Field, Float, HideField, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { VisitForm, VisitFormState } from "@prisma/client";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsUUID,
  MaxDate,
  MaxLength,
  ValidateIf,
} from "class-validator";
import { GenderEntity } from "@app/api/gender/entities/gender.entity";
import { HandednessEntity } from "@app/api/handedness/entities/handedness.entity";
import { LanguageEntity } from "@app/api/language/entities/language.entity";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import type { Wrapper } from "@app/types";
import { AdditionalVisitFormInfoEntity } from "./additional-visit-form-info.entity";
import { AnswerEntity } from "./answer.entity";

registerEnumType(VisitFormState, {
  name: "VisitFormState",
  description: "Visit form states.",
});

@ObjectType()
export class VisitFormEntity extends BaseEntity implements VisitForm {
  @IsObject()
  @Field(() => LanguageEntity)
  probandLanguage: LanguageEntity;

  @IsUUID()
  @HideField()
  probandLanguageId: string;

  @IsOptional()
  @IsObject()
  @Field(() => AdditionalVisitFormInfoEntity, { nullable: true })
  additionalInfo?: Wrapper<AdditionalVisitFormInfoEntity>;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique<AnswerEntity>((elem) => elem.questionId)
  @Field(() => [AnswerEntity])
  answers: AnswerEntity[];

  @IsEnum(VisitFormState)
  @Field(() => VisitFormState)
  state: VisitFormState;

  @IsOptional()
  @IsDate()
  @HideField()
  sentToMafilDbAt: Date | null;

  // MAFILDB native language code
  @MaxLength(5)
  @Field()
  nativeLanguageCode: string;

  @IsUUID()
  @HideField()
  genderId: string;

  @IsObject()
  @Field(() => GenderEntity)
  gender: GenderEntity;

  @IsUUID()
  @HideField()
  handednessId: string;

  @IsObject()
  @Field(() => HandednessEntity)
  handedness: HandednessEntity;

  @MaxLength(200)
  @Field()
  name: string;

  @MaxLength(200)
  @Field()
  surname: string;

  @MaxLength(50)
  @Field()
  personalId: string;

  @IsDate()
  @MaxDate(() => new Date())
  @Field()
  birthdate: Date;

  @IsNumber()
  @IsPositive()
  @Field(() => Int)
  heightCm: number;

  @IsNumber()
  @IsPositive()
  @Field(() => Int)
  weightKg: number;

  @IsNumber()
  @Field(() => Float)
  visualCorrectionDioptre: number;

  @ValidateIf((object: VisitFormEntity) => object.email !== "")
  @IsEmail()
  @MaxLength(320)
  @Field()
  email: string;

  @ValidateIf((object: VisitFormEntity) => object.phone !== "")
  @IsMobilePhone()
  @MaxLength(50)
  @Field()
  phone: string;
}
