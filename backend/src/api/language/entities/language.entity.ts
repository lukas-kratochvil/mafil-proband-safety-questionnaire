import { Field, ObjectType } from "@nestjs/graphql";
import { Language } from "@prisma/client";
import { MaxLength } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";

@ObjectType()
export class LanguageEntity extends BaseEntity implements Language {
  @MaxLength(5)
  @Field()
  code: string;

  @MaxLength(25)
  @Field()
  name: string;
}
