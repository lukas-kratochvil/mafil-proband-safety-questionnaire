import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { HandednessTranslation } from "@prisma/client";
import { IsString, IsUUID } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";

@ObjectType()
export class HandednessTranslationEntity extends BaseEntity implements HandednessTranslation {
  @HideField()
  @IsUUID()
  handednessId: string;

  @HideField()
  @IsUUID()
  languageId: string;

  @Field()
  @IsString()
  text: string;
}
