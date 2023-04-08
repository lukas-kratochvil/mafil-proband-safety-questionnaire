import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { IsArray, IsObject, IsString } from "class-validator";
import { LanguageEntity } from "@app/api/language/entities/language.entity";
import { BaseEntity } from "./base.entity";

@ObjectType({ isAbstract: true })
export class TranslationLanguageEntity extends PickType(LanguageEntity, ["code", "name"]) {}

@ObjectType({ isAbstract: true })
export class TranslationEntity {
  @IsString()
  @Field()
  text: string;

  @IsObject()
  @Field(() => TranslationLanguageEntity)
  language: TranslationLanguageEntity;
}

@ObjectType({ isAbstract: true })
export class TranslationBaseEntity extends BaseEntity {
  @IsArray()
  @Field(() => [TranslationEntity])
  translations: TranslationEntity[];
}
