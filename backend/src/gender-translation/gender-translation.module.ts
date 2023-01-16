import { Module } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { GenderTranslationResolver } from "./gender-translation.resolver";
import { GenderTranslationService } from "./gender-translation.service";

@Module({
  providers: [GenderTranslationResolver, GenderTranslationService, PrismaService],
})
export class GenderTranslationModule {}