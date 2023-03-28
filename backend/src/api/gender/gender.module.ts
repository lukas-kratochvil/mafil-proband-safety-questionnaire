import { Module } from "@nestjs/common";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import { GenderResolver } from "./gender.resolver";
import { GenderService } from "./gender.service";

@Module({
  providers: [GenderResolver, GenderService, PrismaService, LanguageService],
})
export class GenderModule {}
