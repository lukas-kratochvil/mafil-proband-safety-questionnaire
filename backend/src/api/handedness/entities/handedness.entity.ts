import { Field, ObjectType } from "@nestjs/graphql";
import { Handedness } from "@prisma/client";
import { TranslationBaseEntity } from "@app/api/graphql/entities/translation-base.entity";

@ObjectType()
export class HandednessEntity extends TranslationBaseEntity implements Handedness {
  @Field()
  code: string;
}
