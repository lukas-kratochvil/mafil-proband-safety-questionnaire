import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProbandContactConsentEntity {
  @Field()
  title: string;

  @Field()
  bodyHtml: string;
}
