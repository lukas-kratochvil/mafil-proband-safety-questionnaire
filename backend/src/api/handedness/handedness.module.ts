import { Module } from "@nestjs/common";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import { HandednessResolver } from "./handedness.resolver";
import { HandednessService } from "./handedness.service";

@Module({
  providers: [HandednessResolver, HandednessService, PrismaService, LanguageService],
})
export class HandednessModule {}
