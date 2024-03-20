import { Field, Int, ObjectType } from "@nestjs/graphql";
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

@ObjectType()
export class NativeLanguageEntity {
  @IsString()
  @Field()
  code: string;

  @IsString()
  @Field()
  nativeName: string;

  @IsString()
  @Field()
  nameCs: string;

  @IsString()
  @Field()
  nameEn: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field(() => Int, { nullable: true })
  priority: number | null;
}
