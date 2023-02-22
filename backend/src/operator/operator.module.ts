import { Module } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { OperatorResolver } from "./operator.resolver";
import { OperatorService } from "./operator.service";

@Module({
  providers: [OperatorResolver, OperatorService, PrismaService],
})
export class OperatorModule {}
