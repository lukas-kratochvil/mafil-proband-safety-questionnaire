import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { HandednessTranslationResolver } from "./handedness-translation.resolver";
import { HandednessTranslationService } from "./handedness-translation.service";

@Module({
  providers: [HandednessTranslationResolver, HandednessTranslationService, PrismaService],
  exports: [HandednessTranslationResolver],
})
export class HandednessTranslationModule {}
