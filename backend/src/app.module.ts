import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { seconds, ThrottlerModule } from "@nestjs/throttler";
import { GraphQLApiModule } from "./api/graphql-api.module";
import { EnvironmentVariables, envVarsValidationSchema } from "./config/validation";
import { CronModule } from "./cron/cron.module";
import { LoggerMiddleware } from "./log/logger.middleware";
import { ThrottlerGuard } from "./throttling/throttler.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema: envVarsValidationSchema,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => [
        {
          ttl: seconds(config.get("THROTTLE_TTL", { infer: true })),
          limit: config.get("THROTTLE_LIMIT", { infer: true }),
        },
      ],
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
