import { Field, ObjectType } from "@nestjs/graphql";
import { Handedness } from "@prisma/client";
import { MaxLength } from "class-validator";
import { TranslationBaseEntity } from "@app/api/utils/entities/translation-base.entity";

@ObjectType()
export class HandednessEntity extends TranslationBaseEntity implements Handedness {
  @Field()
  @MaxLength(2)
  code: string;
}
