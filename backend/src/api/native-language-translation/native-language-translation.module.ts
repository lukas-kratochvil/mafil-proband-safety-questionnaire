import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { NativeLanguageTranslationResolver } from "./native-language-translation.resolver";
import { NativeLanguageTranslationService } from "./native-language-translation.service";

@Module({
  providers: [NativeLanguageTranslationResolver, NativeLanguageTranslationService, PrismaService],
  exports: [NativeLanguageTranslationResolver],
})
export class NativeLanguageTranslationModule {}
