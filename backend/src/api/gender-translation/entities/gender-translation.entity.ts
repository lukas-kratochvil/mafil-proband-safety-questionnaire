import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { GenderTranslation } from "@prisma/client";
import { IsString, IsUUID } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";

@ObjectType()
export class GenderTranslationEntity extends BaseEntity implements GenderTranslation {
  @HideField()
  @IsUUID()
  genderId: string;

  @HideField()
  @IsUUID()
  languageId: string;

  @Field()
  @IsString()
  text: string;
}
