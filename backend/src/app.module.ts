import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import Joi from "joi";
import { GraphQLApiModule } from "./api/graphql-api.module";
import { ALLOWED_NODE_ENVS, ALLOWED_PDF_LANGUAGE_CODES, EnvironmentVariables } from "./config";
import { CronModule } from "./cron/cron.module";
import { AuthGuard } from "./guards/auth/auth.guard";
import { ThrottlerGuard } from "./guards/throttler/throttler.guard";
import { LoggerMiddleware } from "./middleware/logger.middleware";

const TIMEZONE_REGEX = "^[A-Z][a-z]*/[A-Z][a-z_-]*(/[A-Z][a-z_-]*)?$";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object<EnvironmentVariables>({
        NODE_ENV: Joi.string()
          .trim()
          .valid(...ALLOWED_NODE_ENVS)
          .required(),
        PORT: Joi.number().integer().required(),
        DATABASE_URL: Joi.string().trim().required(),
        WEB_API_KEY: Joi.string().trim().required(),
        PDF_OPERATOR_LANGUAGE_CODE: Joi.string()
          .trim()
          .valid(...ALLOWED_PDF_LANGUAGE_CODES)
          .required(),
        TZ: Joi.string().trim().pattern(new RegExp(TIMEZONE_REGEX)).required(),
        THROTTLE_TTL: Joi.number().integer().required(),
        THROTTLE_LIMIT: Joi.number().integer().required(),
        WEB_DOMAIN: Joi.string().uri().required(),
      }).required(),
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
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
