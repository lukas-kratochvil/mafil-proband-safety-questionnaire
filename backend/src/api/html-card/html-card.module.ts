import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { HTMLCardResolver } from "./html-card.resolver";
import { HTMLCardService } from "./html-card.service";

@Module({
  providers: [HTMLCardResolver, HTMLCardService, PrismaService],
  exports: [HTMLCardResolver],
})
export class HTMLCardModule {}
