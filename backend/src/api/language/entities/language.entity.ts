import { Field, ObjectType } from "@nestjs/graphql";
import { Language } from "@prisma/client";
import { BaseEntity } from "@app/api/graphql/entities/base.entity";

@ObjectType()
export class LanguageEntity extends BaseEntity implements Language {
  @Field()
  code: string;

  @Field()
  name: string;
}
