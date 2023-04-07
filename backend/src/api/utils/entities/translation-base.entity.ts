import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { IsArray, IsInstance, IsString } from "class-validator";
import { LanguageEntity } from "@app/api/language/entities/language.entity";
import { BaseEntity } from "./base.entity";

@ObjectType({ isAbstract: true })
export class TranslationLanguageEntity extends PickType(LanguageEntity, ["code", "name"]) {}

@ObjectType({ isAbstract: true })
export class TranslationEntity {
  @Field()
  @IsString()
  text: string;

  @Field(() => TranslationLanguageEntity)
  @IsInstance(TranslationLanguageEntity)
  language: TranslationLanguageEntity;
}

@ObjectType({ isAbstract: true })
export class TranslationBaseEntity extends BaseEntity {
  @Field(() => [TranslationEntity])
  @IsArray()
  translations: TranslationEntity[];
}
