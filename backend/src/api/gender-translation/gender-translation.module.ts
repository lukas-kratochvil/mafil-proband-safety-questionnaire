import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { GenderTranslationResolver } from "./gender-translation.resolver";
import { GenderTranslationService } from "./gender-translation.service";

@Module({
  providers: [GenderTranslationResolver, GenderTranslationService, PrismaService],
  exports: [GenderTranslationResolver],
})
export class GenderTranslationModule {}
