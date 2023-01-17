import { Field, ObjectType } from "@nestjs/graphql";
import { Gender } from "@prisma/client";
import { TranslationBaseEntity } from "@graphql/entities/translation-base.entity";

@ObjectType()
export class GenderEntity extends TranslationBaseEntity implements Gender {
  @Field()
  code: string;
}
