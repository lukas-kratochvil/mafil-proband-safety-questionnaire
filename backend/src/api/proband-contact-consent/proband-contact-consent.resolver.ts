import { Args, Query, Resolver } from "@nestjs/graphql";
import { ProbandContactConsentEntity } from "./entities/proband-contact-consent.entity";
import { ProbandContactConsentService } from "./proband-contact-consent.service";

@Resolver(() => ProbandContactConsentEntity)
export class ProbandContactConsentResolver {
  constructor(private readonly probandContactConsentService: ProbandContactConsentService) {}

  @Query(() => ProbandContactConsentEntity, { name: "probandContactConsent" })
  findOne(@Args("locale", { type: () => String }) locale: string): Promise<ProbandContactConsentEntity> {
    return this.probandContactConsentService.findOne(locale);
  }
}
