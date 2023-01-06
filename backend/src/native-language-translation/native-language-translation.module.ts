import { Module } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { NativeLanguageTranslationResolver } from "./native-language-translation.resolver";
import { NativeLanguageTranslationService } from "./native-language-translation.service";

@Module({
  providers: [NativeLanguageTranslationResolver, NativeLanguageTranslationService, PrismaService],
})
export class NativeLanguageTranslationModule {}
