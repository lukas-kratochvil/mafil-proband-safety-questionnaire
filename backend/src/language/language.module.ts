import { Module } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { LanguageResolver } from "./language.resolver";
import { LanguageService } from "./language.service";

@Module({
  providers: [LanguageResolver, LanguageService, PrismaService],
})
export class LanguageModule {}
