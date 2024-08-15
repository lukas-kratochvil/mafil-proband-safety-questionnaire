import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD, Reflector } from "@nestjs/core";
import type { EnvironmentVariables } from "@app/config/validation";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthGuard } from "./auth.guard";
import { AuthGuardDev } from "./auth.guard.dev";
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
      inject: [AUTH_SERVICE, ConfigService, Reflector],
      useFactory: (
        authService: AuthService,
        config: ConfigService<EnvironmentVariables, true>,
        reflector: Reflector
      ) =>
        config.get("nodeEnv", { infer: true }) === "production"
          ? new AuthGuard(authService, reflector, config)
          : new AuthGuardDev(),
    },
    // Operator service
    OperatorService,
    PrismaService,
  ],
  exports: [OperatorResolver],
})
export class OperatorModule {}
