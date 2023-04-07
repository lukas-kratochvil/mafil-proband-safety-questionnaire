import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { NativeLanguageTranslation } from "@prisma/client";
import { IsString, IsUUID } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";

@ObjectType()
export class NativeLanguageTranslationEntity extends BaseEntity implements NativeLanguageTranslation {
  @HideField()
  @IsUUID()
  nativeLanguageId: string;

  @HideField()
  @IsUUID()
  languageId: string;

  @Field()
  @IsString()
  text: string;
}
