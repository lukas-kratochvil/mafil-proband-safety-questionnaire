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
  @IsInstance(LanguageEntity)
  @Field(() => LanguageEntity)
  probandLanguage: LanguageEntity;

  @IsUUID()
  @HideField()
  probandLanguageId: string;

  @IsOptional()
  @IsInstance(AdditionalVisitFormInfoEntity)
  @Field(() => AdditionalVisitFormInfoEntity, { nullable: true })
  additionalInfo?: AdditionalVisitFormInfoEntity;

  @IsArray()
  @Field(() => [AnswerEntity])
  answers: AnswerEntity[];

  @IsEnum(VisitFormState)
  @Field(() => VisitFormState)
  state: VisitFormState;

  @IsOptional()
  @IsDate()
  @HideField()
  sentToMafilDbAt: Date | null;

  @IsUUID()
  @HideField()
  nativeLanguageId: string;

  @IsInstance(NativeLanguageEntity)
  @Field(() => NativeLanguageEntity)
  nativeLanguage: NativeLanguageEntity;

  @IsUUID()
  @HideField()
  genderId: string;

  @IsInstance(GenderEntity)
  @Field(() => GenderEntity)
  gender: GenderEntity;

  @IsUUID()
  @HideField()
  handednessId: string;

  @IsInstance(HandednessEntity)
  @Field(() => HandednessEntity)
  handedness: HandednessEntity;

  @IsArray()
  @Field(() => [VisitFormEntity])
  visitForms: VisitFormEntity[];

  @MaxLength(200)
  @Field()
  name: string;

  @MaxLength(200)
  @Field()
  surname: string;

  @MaxLength(50)
  @Field()
  personalId: string;

  @MaxDate(() => new Date())
  @Field()
  birthdate: Date;

  @IsPositive()
  @Field(() => Float)
  heightCm: number;

  @IsPositive()
  @Field(() => Float)
  weightKg: number;

  @IsNumber()
  @Field(() => Float)
  visualCorrectionDioptre: number;

  @ValidateIf((object) => object.email !== "")
  @IsEmail()
  @Field()
  email: string;

  @ValidateIf((object) => object.phone !== "")
  @IsMobilePhone()
  @Field()
  phone: string;
}
