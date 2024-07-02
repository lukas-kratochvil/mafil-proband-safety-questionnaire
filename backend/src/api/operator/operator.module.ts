import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { AUTH_PRISMA_SERVICE, AUTH_SERVICE } from "./constants";
import { OperatorResolver } from "./operator.resolver";
import { OperatorService } from "./operator.service";

@Module({
  providers: [
    // Operator resolver
    OperatorResolver,
    // Auth service
    {
      provide: AUTH_PRISMA_SERVICE,
      useClass: PrismaService,
    },
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    // Auth guard
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // Operator service
    OperatorService,
    PrismaService,
  ],
  exports: [OperatorResolver],
})
export class OperatorModule {}
