import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { LanguageModule } from "../language/language.module";
import { NativeLanguageResolver } from "./native-language.resolver";
import { NativeLanguageService } from "./native-language.service";

@Module({
  imports: [LanguageModule],
  providers: [NativeLanguageResolver, NativeLanguageService, PrismaService],
  exports: [NativeLanguageResolver],
})
export class NativeLanguageModule {}
