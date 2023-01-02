import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { VisitForm } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";
import { LanguageEntity } from "@language/entities/language.entity";
import { AdditionalVisitFormInfoEntity } from "./additional-visit-form-info.entity";
import { ProbandInfoEntity } from "./proband-info.entity";

@ObjectType()
export class VisitFormEntity extends BaseEntity implements VisitForm {
  @Field(() => ProbandInfoEntity)
  probandInfo: ProbandInfoEntity;

  @HideField()
  probandInfoId: string;

  @Field(() => LanguageEntity)
  probandLanguage: LanguageEntity;

  @HideField()
  probandLanguageId: string;

  @Field(() => AdditionalVisitFormInfoEntity, { nullable: true })
  additionalInfo: AdditionalVisitFormInfoEntity | null;

  @HideField()
  additionalInfoId: string | null;

  @Field()
  state: string;

  @Field(() => String, { nullable: true })
  note: string | null;

  @Field(() => String, { nullable: true })
  visitId: string | null;

  // TODO: What is the correct GraphQL type for a PDF?
  @Field(() => String, { nullable: true })
  pdf: Buffer | null;
}
