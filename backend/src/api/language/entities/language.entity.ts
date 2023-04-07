import { Field, ObjectType } from "@nestjs/graphql";
import { Language } from "@prisma/client";
import { MaxLength } from "class-validator";
import { BaseEntity } from "@app/api/utils/entities/base.entity";

@ObjectType()
export class LanguageEntity extends BaseEntity implements Language {
  @Field()
  @MaxLength(5)
  code: string;

  @Field()
  @MaxLength(25)
  name: string;
}
