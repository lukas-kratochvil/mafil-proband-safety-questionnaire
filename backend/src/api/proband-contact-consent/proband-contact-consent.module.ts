import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { ProbandContactConsentResolver } from "./proband-contact-consent.resolver";
import { ProbandContactConsentService } from "./proband-contact-consent.service";

@Module({
  providers: [ProbandContactConsentResolver, ProbandContactConsentService, PrismaService],
})
export class ProbandContactConsentModule {}
