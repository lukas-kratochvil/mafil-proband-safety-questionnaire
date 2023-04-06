import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { LanguageResolver } from "./language.resolver";
import { LanguageService } from "./language.service";

@Module({
  providers: [LanguageResolver, LanguageService, PrismaService],
  exports: [LanguageResolver, LanguageService],
})
export class LanguageModule {}
