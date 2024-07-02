import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { GraphQLApiModule } from "./api/graphql-api.module";
import { EnvironmentVariables, envVarsValidationSchema } from "./config";
import { CronModule } from "./cron/cron.module";
import { ThrottlerGuard } from "./guards/throttler/throttler.guard";
import { LoggerMiddleware } from "./middleware/logger.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envVarsValidationSchema,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
        ttl: config.get("THROTTLE_TTL", { infer: true }),
        limit: config.get("THROTTLE_LIMIT", { infer: true }),
      }),
    }),
    GraphQLApiModule,
    CronModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
