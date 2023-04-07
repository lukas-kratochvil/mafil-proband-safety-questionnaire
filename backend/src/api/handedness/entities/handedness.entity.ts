import { Field, ObjectType } from "@nestjs/graphql";
import { Handedness } from "@prisma/client";
import { MaxLength } from "class-validator";
import { TranslationBaseEntity } from "@app/api/utils/entities/translation-base.entity";

@ObjectType()
export class HandednessEntity extends TranslationBaseEntity implements Handedness {
  @MaxLength(2)
  @Field()
  code: string;
}
