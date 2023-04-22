import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "@app/prisma/prisma.service";
import { PDFResolver } from "./pdf.resolver";
import { PDFService } from "./pdf.service";

@Module({
  imports: [ConfigModule],
  providers: [PDFResolver, PDFService, PrismaService],
  exports: [PDFResolver],
})
export class PDFModule {}
