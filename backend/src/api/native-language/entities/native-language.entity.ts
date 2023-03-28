import { Field, Int, ObjectType } from "@nestjs/graphql";
import { NativeLanguage } from "@prisma/client";
import { TranslationBaseEntity } from "@app/api/graphql/entities/translation-base.entity";

@ObjectType()
export class NativeLanguageEntity extends TranslationBaseEntity implements NativeLanguage {
  @Field()
  code: string;

  @Field(() => Int, { nullable: true })
  order: number | null;
}
