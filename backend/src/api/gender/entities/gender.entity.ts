import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Gender } from "@prisma/client";
import { IsInt, IsPositive, MaxLength } from "class-validator";
import { TranslationBaseEntity } from "@app/api/utils/entities/translation-base.entity";

@ObjectType()
export class GenderEntity extends TranslationBaseEntity implements Gender {
  @MaxLength(1)
  @Field()
  code: string;

  @IsInt()
  @IsPositive()
  @Field(() => Int)
  order: number;
}
