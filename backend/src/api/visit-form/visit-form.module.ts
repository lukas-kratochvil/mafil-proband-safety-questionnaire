import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { VisitFormResolver } from "./visit-form.resolver";
import { VisitFormService } from "./visit-form.service";

@Module({
  providers: [VisitFormResolver, VisitFormService, PrismaService],
  exports: [VisitFormResolver],
})
export class VisitFormModule {}
