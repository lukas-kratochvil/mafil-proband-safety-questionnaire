import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { CronPrismaTasksService } from "./cron-prisma-tasks.service";

@Module({
  providers: [CronPrismaTasksService, PrismaService],
})
export class CronModule {}
