import { ArgsType, Field } from "@nestjs/graphql";
import { IsString, MaxLength } from "class-validator";

@ArgsType()
export class ProbandContactRequestArgs {
  @Field()
  @MaxLength(5)
  locale: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  surname: string;

  @Field()
  @IsString()
  birthdateStr: string;

  @Field()
  @IsString()
  currentDateStr: string;
}
