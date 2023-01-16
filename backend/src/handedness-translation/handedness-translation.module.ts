import { Module } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { HandednessTranslationResolver } from "./handedness-translation.resolver";
import { HandednessTranslationService } from "./handedness-translation.service";

@Module({
  providers: [HandednessTranslationResolver, HandednessTranslationService, PrismaService],
})
export class HandednessTranslationModule {}
