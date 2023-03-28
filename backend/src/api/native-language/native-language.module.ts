import { Module } from "@nestjs/common";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import { NativeLanguageResolver } from "./native-language.resolver";
import { NativeLanguageService } from "./native-language.service";

@Module({
  providers: [NativeLanguageResolver, NativeLanguageService, PrismaService, LanguageService],
})
export class NativeLanguageModule {}
