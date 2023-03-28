import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { HandednessTranslation } from "@prisma/client";
import { BaseEntity } from "@app/api/graphql/entities/base.entity";

@ObjectType()
export class HandednessTranslationEntity extends BaseEntity implements HandednessTranslation {
  @HideField()
  handednessId: string;

  @HideField()
  languageId: string;

  @Field()
  text: string;
}
