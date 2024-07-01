import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AUTH_PRISMA_SERVICE } from "@app/constants";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthGuard } from "./auth.guard";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";

@Module({
  providers: [
    AuthResolver,
    AuthService,
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
  ],
  exports: [AuthResolver, AuthService],
})
export class AuthModule {}
