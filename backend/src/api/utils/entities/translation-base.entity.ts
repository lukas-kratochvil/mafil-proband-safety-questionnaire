import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { ArrayNotEmpty, ArrayUnique, IsArray, IsObject, IsString } from "class-validator";
import { LanguageEntity } from "@app/api/language/entities/language.entity";
import { BaseEntity } from "./base.entity";

@ObjectType({ isAbstract: true })
class TranslationLanguageEntity extends PickType(LanguageEntity, ["code", "name"] as const) {}

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
  @ArrayNotEmpty()
  @ArrayUnique<TranslationEntity>((elem) => elem.language.code)
  @Field(() => [TranslationEntity])
  translations: TranslationEntity[];
}
