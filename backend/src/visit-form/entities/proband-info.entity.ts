import { Field, Float, ObjectType } from "@nestjs/graphql";
import { ProbandInfo } from "@prisma/client";
import { BaseEntity } from "@app/graphql/entities/base.entity";
import { UuidScalar } from "@app/graphql/scalars/uuid-scalar";
import { VisitFormEntity } from "@app/visit-form/entities/visit-form.entity";

@ObjectType()
export class ProbandInfoEntity extends BaseEntity implements ProbandInfo {
  @Field(() => UuidScalar)
  nativeLanguageId: string;

  @Field(() => UuidScalar)
  genderId: string;

  @Field(() => UuidScalar)
  handednessId: string;

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

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  phone: string | null;
}
