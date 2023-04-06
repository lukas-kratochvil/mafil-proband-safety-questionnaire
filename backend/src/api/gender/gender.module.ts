import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { LanguageModule } from "../language/language.module";
import { GenderResolver } from "./gender.resolver";
import { GenderService } from "./gender.service";

@Module({
  imports: [LanguageModule],
  providers: [GenderResolver, GenderService, PrismaService],
  exports: [GenderResolver],
})
export class GenderModule {}
