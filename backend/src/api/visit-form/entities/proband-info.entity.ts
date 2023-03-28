import { Field, Float, HideField, ObjectType } from "@nestjs/graphql";
import { ProbandInfo } from "@prisma/client";
import { GenderEntity } from "@app/api/gender/entities/gender.entity";
import { BaseEntity } from "@app/api/graphql/entities/base.entity";
import { HandednessEntity } from "@app/api/handedness/entities/handedness.entity";
import { NativeLanguageEntity } from "@app/api/native-language/entities/native-language.entity";
import { VisitFormEntity } from "@app/api/visit-form/entities/visit-form.entity";

@ObjectType()
export class ProbandInfoEntity extends BaseEntity implements ProbandInfo {
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
