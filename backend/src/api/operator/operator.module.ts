import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AUTH_PRISMA_SERVICE, AUTH_SERVICE } from "@app/constants";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { OperatorResolver } from "./operator.resolver";
import { OperatorService } from "./operator.service";

@Module({
  providers: [
    OperatorResolver,
    AuthService,
    // Auth guard
    {
      provide: AUTH_PRISMA_SERVICE,
      useClass: PrismaService,
    },
    ConfigService,
    {
      provide: APP_GUARD,
      inject: [AuthService, ConfigService, Reflector],
      useFactory: (authService, config, reflector) => new AuthGuard(authService, config, reflector),
    },
    // Operator service
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    OperatorService,
    PrismaService,
  ],
  exports: [OperatorResolver],
})
export class OperatorModule {}
