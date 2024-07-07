import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { VisitFormTasksService } from "./visit-form-tasks.service";

@Module({
  providers: [VisitFormTasksService, PrismaService],
  exports: [VisitFormTasksService],
})
export class CronModule {}
