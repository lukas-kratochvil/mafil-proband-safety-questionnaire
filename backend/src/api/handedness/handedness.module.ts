import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { LanguageModule } from "../language/language.module";
import { HandednessResolver } from "./handedness.resolver";
import { HandednessService } from "./handedness.service";

@Module({
  imports: [LanguageModule],
  providers: [HandednessResolver, HandednessService, PrismaService],
  exports: [HandednessResolver],
})
export class HandednessModule {}
