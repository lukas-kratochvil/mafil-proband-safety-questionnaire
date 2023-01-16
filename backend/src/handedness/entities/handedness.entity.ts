import { Field, ObjectType } from "@nestjs/graphql";
import { Handedness } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";
import { TranslationEntity } from "@language/entities/translation-language.entity";

@ObjectType()
export class HandednessEntity extends BaseEntity implements Handedness {
  @Field(() => [TranslationEntity])
  translations: TranslationEntity[];
}
