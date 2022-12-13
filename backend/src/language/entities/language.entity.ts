import { Field, ObjectType } from "@nestjs/graphql";
import { Language } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";

@ObjectType()
export class LanguageEntity extends BaseEntity implements Language {
  @Field()
  name: string;

  @Field()
  locale: string;
}