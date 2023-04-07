import { Field, Int, ObjectType } from "@nestjs/graphql";
import { NativeLanguage } from "@prisma/client";
import { IsInt, IsOptional, MaxLength } from "class-validator";
import { TranslationBaseEntity } from "@app/api/utils/entities/translation-base.entity";

@ObjectType()
export class NativeLanguageEntity extends TranslationBaseEntity implements NativeLanguage {
  @MaxLength(2)
  @Field()
  code: string;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  order: number | null;
}
