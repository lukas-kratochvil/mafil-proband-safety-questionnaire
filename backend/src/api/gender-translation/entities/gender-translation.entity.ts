import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { GenderTranslation } from "@prisma/client";
import { BaseEntity } from "@app/api/utils/entities/base.entity";

@ObjectType()
export class GenderTranslationEntity extends BaseEntity implements GenderTranslation {
  @HideField()
  genderId: string;

  @HideField()
  languageId: string;

  @Field()
  text: string;
}
