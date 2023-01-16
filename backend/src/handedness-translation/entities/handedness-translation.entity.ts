import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { HandednessTranslation } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";

@ObjectType()
export class HandednessTranslationEntity extends BaseEntity implements HandednessTranslation {
  @HideField()
  handednessId: string;

  @HideField()
  languageId: string;

  @Field()
  text: string;
}
