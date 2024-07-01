import { Module } from "@nestjs/common";
import { AuthModule } from "@app/auth/auth.module";
import { AuthService } from "@app/auth/auth.service";
import { AUTH_PRISMA_SERVICE, AUTH_SERVICE } from "@app/constants";
import { PrismaService } from "@app/prisma/prisma.service";
import { OperatorResolver } from "./operator.resolver";
import { OperatorService } from "./operator.service";

@Module({
  imports: [AuthModule],
  providers: [
    OperatorResolver,
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: AUTH_PRISMA_SERVICE,
      useClass: PrismaService,
    },
    OperatorService,
    PrismaService,
  ],
  exports: [OperatorResolver],
})
export class OperatorModule {}
