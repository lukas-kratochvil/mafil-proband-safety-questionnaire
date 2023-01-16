import { TranslationBaseEntity } from "@graphql/entities/translation-base.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { NativeLanguage } from "@prisma/client";

@ObjectType()
export class NativeLanguageEntity extends TranslationBaseEntity implements NativeLanguage {
  @Field(() => Int, { nullable: true })
  order: number | null;
}
