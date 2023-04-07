import { ArgsType, Field } from "@nestjs/graphql";
import { IsString } from "class-validator";

@ArgsType()
export class ProbandContactRequestArgs {
  @IsString()
  @Field()
  locale: string;

  @IsString()
  @Field()
  name: string;

  @IsString()
  @Field()
  surname: string;

  @IsString()
  @Field()
  birthdateStr: string;

  @IsString()
  @Field()
  currentDateStr: string;
}
