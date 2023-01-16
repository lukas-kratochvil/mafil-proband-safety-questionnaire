import { TranslationBaseEntity } from "@graphql/entities/translation-base.entity";
import { ObjectType } from "@nestjs/graphql";
import { Handedness } from "@prisma/client";

@ObjectType()
export class HandednessEntity extends TranslationBaseEntity implements Handedness {}
