import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";

@Module({
  providers: [
    AuthResolver,
    AuthService,
    ConfigService,
    {
      provide: APP_GUARD,
      inject: [ConfigService, Reflector],
      useFactory: (config, reflector) => new AuthGuard(config, reflector),
    },
  ],
  exports: [AuthResolver],
})
export class AuthModule {}
