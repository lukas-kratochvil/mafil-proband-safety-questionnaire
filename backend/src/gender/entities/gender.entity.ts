import { Field, ObjectType } from "@nestjs/graphql";
import { Gender } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";
import { TranslationEntity } from "@language/entities/translation-language.entity";

@ObjectType()
export class GenderEntity extends BaseEntity implements Gender {
  @Field(() => [TranslationEntity])
  translations: TranslationEntity[];

  @Field()
  code: string;
}
