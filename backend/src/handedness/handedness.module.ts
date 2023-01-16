import { Module } from "@nestjs/common";
import { LanguageService } from "@language/language.service";
import { PrismaService } from "@prisma/prisma.service";
import { HandednessResolver } from "./handedness.resolver";
import { HandednessService } from "./handedness.service";

@Module({
  providers: [HandednessResolver, HandednessService, PrismaService, LanguageService],
})
export class HandednessModule {}
