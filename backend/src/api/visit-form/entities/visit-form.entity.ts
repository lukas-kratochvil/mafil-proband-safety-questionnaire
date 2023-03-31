import { Field, Float, HideField, ObjectType, registerEnumType } from "@nestjs/graphql";
import { VisitForm, VisitFormState } from "@prisma/client";
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
  probandLanguage: LanguageEntity;

  @HideField()
  probandLanguageId: string;

  @Field(() => AdditionalVisitFormInfoEntity, { nullable: true })
  additionalInfo?: AdditionalVisitFormInfoEntity;

  @Field(() => [AnswerEntity])
  answers: AnswerEntity[];

  @Field(() => VisitFormState)
  state: VisitFormState;

  @HideField()
  nativeLanguageId: string;

  @Field(() => NativeLanguageEntity)
  nativeLanguage: NativeLanguageEntity;

  @HideField()
  genderId: string;

  @Field(() => GenderEntity)
  gender: GenderEntity;

  @HideField()
  handednessId: string;

  @Field(() => HandednessEntity)
  handedness: HandednessEntity;

  @Field(() => [VisitFormEntity])
  visitForms: VisitFormEntity[];

  @Field()
  name: string;

  @Field()
  surname: string;

  @Field()
  personalId: string;

  @Field(() => Date)
  birthdate: Date;

  @Field(() => Float)
  heightCm: number;

  @Field(() => Float)
  weightKg: number;

  @Field(() => Float)
  visualCorrectionDioptre: number;

  @Field()
  email: string;

  @Field()
  phone: string;
}
