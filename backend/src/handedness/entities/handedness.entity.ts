import { ObjectType } from "@nestjs/graphql";
import { Handedness } from "@prisma/client";
import { TranslationBaseEntity } from "@app/graphql/entities/translation-base.entity";

@ObjectType()
export class HandednessEntity extends TranslationBaseEntity implements Handedness {}
