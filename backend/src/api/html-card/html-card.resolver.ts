import { Args, Query, Resolver } from "@nestjs/graphql";
import { ProbandContactRequestArgs } from "./dto/proband-contact-request.args";
import { HTMLCardEntity } from "./entities/html-card.entity";
import { HTMLCardService } from "./html-card.service";

@Resolver(() => HTMLCardEntity)
export class HTMLCardResolver {
  constructor(private readonly htmlCardService: HTMLCardService) {}

  @Query(() => HTMLCardEntity, { name: "entryInfo" })
  async getEntryInfo(@Args("locale", { type: () => String }) locale: string) {
    return this.htmlCardService.getEntryInfo(locale);
  }

  @Query(() => HTMLCardEntity, { name: "safetyInfo" })
  async getSafetyInfo(@Args("locale", { type: () => String }) locale: string) {
    return this.htmlCardService.getSafetyInfo(locale);
  }

  @Query(() => HTMLCardEntity, { name: "beforeExamination" })
  async getBeforeExamination(@Args("locale", { type: () => String }) locale: string) {
    return this.htmlCardService.getBeforeExamination(locale);
  }

  @Query(() => HTMLCardEntity, { name: "examinationConsent" })
  async getExaminationConsent(@Args("locale", { type: () => String }) locale: string) {
    return this.htmlCardService.getExaminationConsent(locale);
  }

  @Query(() => HTMLCardEntity, { name: "probandContactRequest" })
  async getProbandContactRequest(@Args() probandContactRequest: ProbandContactRequestArgs) {
    return this.htmlCardService.getProbandContactRequest(probandContactRequest.locale, probandContactRequest);
  }

  @Query(() => HTMLCardEntity, { name: "probandContactConsent" })
  async getProbandContactConsent(@Args("locale", { type: () => String }) locale: string) {
    return this.htmlCardService.getProbandContactConsent(locale);
  }
}
