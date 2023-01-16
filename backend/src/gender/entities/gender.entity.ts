import { TranslationBaseEntity } from "@graphql/entities/translation-base.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { Gender } from "@prisma/client";

@ObjectType()
export class GenderEntity extends TranslationBaseEntity implements Gender {
  @Field()
  code: string;
}
