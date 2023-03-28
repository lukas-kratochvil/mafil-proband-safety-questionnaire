import { Field, HideField, ObjectType, registerEnumType } from "@nestjs/graphql";
import { VisitForm, VisitFormState } from "@prisma/client";
import { LanguageEntity } from "@app/api/language/entities/language.entity";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { AdditionalVisitFormInfoEntity } from "./additional-visit-form-info.entity";
import { AnswerEntity } from "./answer.entity";
import { ProbandInfoEntity } from "./proband-info.entity";

registerEnumType(VisitFormState, {
  name: "VisitFormState",
  description: "The visit form states.",
});

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
  additionalInfo?: AdditionalVisitFormInfoEntity;

  @Field(() => [AnswerEntity])
  answers: AnswerEntity[];

  @Field(() => VisitFormState)
  state: VisitFormState;
}
