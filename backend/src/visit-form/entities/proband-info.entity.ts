import { Field, Float, HideField, ObjectType } from "@nestjs/graphql";
import { ProbandInfo } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";
import { VisitFormEntity } from "@visit-form/entities/visit-form.entity";

@ObjectType()
export class ProbandInfoEntity extends BaseEntity implements ProbandInfo {
  @HideField()
  nativeLanguageId: string;

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

  @Field()
  gender: string;

  @Field(() => Float)
  visualCorrectionDioptre: number;

  @Field()
  handedness: string;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  phone: string | null;
}