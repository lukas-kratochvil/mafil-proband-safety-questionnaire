import { Field, Int, ObjectType } from "@nestjs/graphql";
import { NativeLanguage } from "@prisma/client";
import { IsInt, IsOptional, MaxLength } from "class-validator";
import { TranslationBaseEntity } from "@app/api/utils/entities/translation-base.entity";

@ObjectType()
export class NativeLanguageEntity extends TranslationBaseEntity implements NativeLanguage {
  @Field()
  @MaxLength(2)
  code: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  order: number | null;
}
