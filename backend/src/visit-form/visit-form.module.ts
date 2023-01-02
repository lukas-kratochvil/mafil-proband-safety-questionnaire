import { Module } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { VisitFormResolver } from "./visit-form.resolver";
import { VisitFormService } from "./visit-form.service";

@Module({
  providers: [VisitFormResolver, VisitFormService, PrismaService],
})
export class VisitFormModule {}
