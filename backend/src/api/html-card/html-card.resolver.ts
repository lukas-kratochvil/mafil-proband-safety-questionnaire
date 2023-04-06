import { Args, Query, Resolver } from "@nestjs/graphql";
import { HTMLCardEntity } from "./entities/html-card.entity";
import { HTMLCardService } from "./html-card.service";

@Resolver(() => HTMLCardEntity)
export class HTMLCardResolver {
  constructor(private readonly htmlCardService: HTMLCardService) {}

  @Query(() => HTMLCardEntity, { name: "probandContactConsent" })
  getProbandContactConsent(@Args("locale", { type: () => String }) locale: string): Promise<HTMLCardEntity> {
    return this.htmlCardService.getProbandContactConsent(locale);
  }
}
