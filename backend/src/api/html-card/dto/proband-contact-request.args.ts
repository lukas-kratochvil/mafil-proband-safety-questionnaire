import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class ProbandContactRequestArgs {
  @Field()
  locale: string;

  @Field()
  name: string;

  @Field()
  surname: string;

  @Field()
  birthdateStr: string;

  @Field()
  currentDateStr: string;
}
