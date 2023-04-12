import { Args, Query, Resolver } from "@nestjs/graphql";
import { ProbandContactRequestArgs } from "./dto/proband-contact-request.args";
import { HTMLCardEntity } from "./entities/html-card.entity";
import { HTMLCardService } from "./html-card.service";

@Resolver(() => HTMLCardEntity)
export class HTMLCardResolver {
  constructor(private readonly htmlCardService: HTMLCardService) {}

  @Query(() => HTMLCardEntity, { name: "entryInfo" })
  getEntryInfo(@Args("locale", { type: () => String }) locale: string): Promise<HTMLCardEntity> {
    return this.htmlCardService.getEntryInfo(locale);
  }

  @Query(() => HTMLCardEntity, { name: "safetyInfo" })
  getSafetyInfo(@Args("locale", { type: () => String }) locale: string): Promise<HTMLCardEntity> {
    return this.htmlCardService.getSafetyInfo(locale);
  }

  @Query(() => HTMLCardEntity, { name: "beforeExamination" })
  getBeforeExamination(@Args("locale", { type: () => String }) locale: string): Promise<HTMLCardEntity> {
    return this.htmlCardService.getBeforeExamination(locale);
  }

  @Query(() => HTMLCardEntity, { name: "examinationConsent" })
  getExaminationConsent(@Args("locale", { type: () => String }) locale: string): Promise<HTMLCardEntity> {
    return this.htmlCardService.getExaminationConsent(locale);
  }

  @Query(() => HTMLCardEntity, { name: "probandContactRequest" })
  getProbandContactRequest(@Args() probandContactRequest: ProbandContactRequestArgs): Promise<HTMLCardEntity> {
    return this.htmlCardService.getProbandContactRequest(probandContactRequest.locale, probandContactRequest);
  }

  @Query(() => HTMLCardEntity, { name: "probandContactConsent" })
  getProbandContactConsent(@Args("locale", { type: () => String }) locale: string): Promise<HTMLCardEntity> {
    return this.htmlCardService.getProbandContactConsent(locale);
  }
}
