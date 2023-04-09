import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { PDFResolver } from "./pdf.resolver";
import { PDFService } from "./pdf.service";

@Module({
  providers: [PDFResolver, PDFService, PrismaService],
  exports: [PDFResolver],
})
export class PDFModule {}
