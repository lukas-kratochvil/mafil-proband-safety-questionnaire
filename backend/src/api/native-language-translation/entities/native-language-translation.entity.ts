import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { NativeLanguageTranslation } from "@prisma/client";
import { BaseEntity } from "@app/api/graphql/entities/base.entity";

@ObjectType()
export class NativeLanguageTranslationEntity extends BaseEntity implements NativeLanguageTranslation {
  @HideField()
  nativeLanguageId: string;

  @HideField()
  languageId: string;

  @Field()
  text: string;
}
