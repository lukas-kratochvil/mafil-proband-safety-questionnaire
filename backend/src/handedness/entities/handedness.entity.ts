import { ObjectType } from "@nestjs/graphql";
import { Handedness } from "@prisma/client";
import { TranslationBaseEntity } from "@graphql/entities/translation-base.entity";

@ObjectType()
export class HandednessEntity extends TranslationBaseEntity implements Handedness {}
