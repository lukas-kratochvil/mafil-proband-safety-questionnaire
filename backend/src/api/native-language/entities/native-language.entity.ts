import { Field, Int, ObjectType } from "@nestjs/graphql";
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

@ObjectType()
export class NativeLanguageEntity {
  @IsInt()
  @Field(() => Int)
  id: number;

  @IsString()
  @Field()
  nativeName: string;

  @IsString()
  @Field()
  nameCs: string;

  @IsString()
  @Field()
  nameEn: string;

  @IsString()
  @Field()
  code: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field(() => Int, { nullable: true })
  priority: number | null;
}
