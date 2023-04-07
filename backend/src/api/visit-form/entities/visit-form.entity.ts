import { Field, Float, HideField, ObjectType, registerEnumType } from "@nestjs/graphql";
import { VisitForm, VisitFormState } from "@prisma/client";
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsInstance,
  IsMobilePhone,
  IsNumber,
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
import { NativeLanguageEntity } from "@app/api/native-language/entities/native-language.entity";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { AdditionalVisitFormInfoEntity } from "./additional-visit-form-info.entity";
import { AnswerEntity } from "./answer.entity";

registerEnumType(VisitFormState, {
  name: "VisitFormState",
  description: "The visit form states.",
});

@ObjectType()
export class VisitFormEntity extends BaseEntity implements VisitForm {
  @Field(() => LanguageEntity)
  @IsInstance(LanguageEntity)
  probandLanguage: LanguageEntity;

  @HideField()
  @IsUUID()
  probandLanguageId: string;

  @Field(() => AdditionalVisitFormInfoEntity, { nullable: true })
  @IsOptional()
  @IsInstance(AdditionalVisitFormInfoEntity)
  additionalInfo?: AdditionalVisitFormInfoEntity;

  @Field(() => [AnswerEntity])
  @IsArray()
  answers: AnswerEntity[];

  @Field(() => VisitFormState)
  @IsEnum(VisitFormState)
  state: VisitFormState;

  @HideField()
  @IsOptional()
  @IsDate()
  sentToMafilDbAt: Date | null;

  @HideField()
  @IsUUID()
  nativeLanguageId: string;

  @Field(() => NativeLanguageEntity)
  @IsInstance(NativeLanguageEntity)
  nativeLanguage: NativeLanguageEntity;

  @HideField()
  @IsUUID()
  genderId: string;

  @Field(() => GenderEntity)
  @IsInstance(GenderEntity)
  gender: GenderEntity;

  @HideField()
  @IsUUID()
  handednessId: string;

  @Field(() => HandednessEntity)
  @IsInstance(HandednessEntity)
  handedness: HandednessEntity;

  @Field(() => [VisitFormEntity])
  @IsArray()
  visitForms: VisitFormEntity[];

  @Field()
  @MaxLength(200)
  name: string;

  @Field()
  @MaxLength(200)
  surname: string;

  @Field()
  @MaxLength(50)
  personalId: string;

  @Field()
  @MaxDate(() => new Date())
  birthdate: Date;

  @Field(() => Float)
  @IsPositive()
  heightCm: number;

  @Field(() => Float)
  @IsPositive()
  weightKg: number;

  @Field(() => Float)
  @IsNumber()
  visualCorrectionDioptre: number;

  @Field()
  @ValidateIf((object) => object.email !== "")
  @IsEmail()
  email: string;

  @Field()
  @ValidateIf((object) => object.phone !== "")
  @IsMobilePhone()
  phone: string;
}
